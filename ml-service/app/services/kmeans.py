import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import os
from dotenv import load_dotenv
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from libsql_client import create_client_sync

load_dotenv()
URL = os.getenv("TURSO_DATABASE_URL")
TOKEN = os.getenv("TURSO_AUTH_TOKEN")

def run_analysis():
    client = create_client_sync(URL, auth_token=TOKEN)
    
    # Fase 2: Extracción de Datos
    query = """
    SELECT a.id_actividad, a.es_aleatorio, n.topico,
           COUNT(i.id_intento) as total_intentos,
           AVG(i.puntaje_obtenido) as promedio_puntaje
    FROM actividad a
    JOIN nodo n ON a.id_nodo = n.id_nodo
    LEFT JOIN intento_actividad i ON a.id_actividad = i.id_actividad
    -- Hacemos JOIN con progreso para conocer el estado final del usuario en esa actividad
    LEFT JOIN progreso_actividad pa ON i.id_usuario = pa.id_usuario AND i.id_actividad = pa.id_actividad
    WHERE a.tipo_actividad = 'ejercicio'
      -- IGNORAR las actividades que el trigger marcó como 'saltada'
      AND (pa.estado IS NULL OR pa.estado != 'saltada')
    GROUP BY a.id_actividad
    """
    result = client.execute(query)
    df = pd.DataFrame(result.rows, columns=result.columns).fillna(0)
    client.close()

    if df.empty:
        return df, None, ["No hay datos suficientes para el análisis."]

    # Fase 3: Preparación (Feature Engineering)
    df['categoria'] = df['es_aleatorio'].apply(lambda x: 'Examen' if x else 'Ejercicio')
    X = df[['total_intentos', 'promedio_puntaje']]
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # Fase 4: Modelado (K=3 como en tu Colab)
    k_final = min(3, len(df))
    kmeans = KMeans(n_clusters=k_final, random_state=42, n_init=10)
    df['cluster'] = kmeans.fit_predict(X_scaled)

    # Fase 5: Visualización de alta calidad
    plt.figure(figsize=(12, 6))
    sns.set_style("whitegrid")
    scatter = sns.scatterplot(
        data=df, x='total_intentos', y='promedio_puntaje',
        hue='cluster', style='categoria', palette='viridis', s=200, alpha=0.8
    )
    plt.axhline(60, ls='--', color='red', alpha=0.4, label='Umbral Aprobación')
    plt.title('Segmentación de Desempeño Educativo (Moni-Lab)', fontsize=15)
    plt.xlabel('Intentos Totales (Dificultad Percibida)')
    plt.ylabel('Puntaje Promedio (Rendimiento)')
    plot_path = "temp_plot.png"
    plt.savefig(plot_path, bbox_inches='tight')
    plt.close()

    # Recomendaciones Automáticas (Basado en Clusters y Categorías)
    recomms = []
    
    # 1. Análisis de Exámenes con bajo rendimiento
    examenes_dificiles = df[(df['categoria'] == 'Examen') & (df['promedio_puntaje'] < 60)]
    if not examenes_dificiles.empty:
        topicos = ", ".join(examenes_dificiles['topico'].unique())
        recomms.append({
            "tipo": "ATENCION",
            "mensaje": f"Bajo rendimiento en Examenes de: {topicos}. Sugerencia: Reforzar lecturas previas.",
            "evidencia": examenes_dificiles[['id_actividad', 'topico', 'total_intentos', 'promedio_puntaje']]
        })
    else:
        recomms.append({
            "tipo": "OK",
            "mensaje": "Los examenes mantienen un nivel de aprobacion adecuado.",
            "evidencia": None
        })

    # 2. Alerta de Frustración (Intentos > 1.5 veces la media)
    intentos_medio = df['total_intentos'].mean()
    frustracion = df[df['total_intentos'] > intentos_medio * 1.5]
    if not frustracion.empty:
        recomms.append({
            "tipo": "ALERTA",
            "mensaje": f"{len(frustracion)} ejercicios con intentos inusualmente altos. Posible ambiguedad.",
            "evidencia": frustracion[['id_actividad', 'topico', 'total_intentos', 'promedio_puntaje']]
        })

    return df, plot_path, recomms