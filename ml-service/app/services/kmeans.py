
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import os
from dotenv import load_dotenv
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from libsql_client import create_client_sync

# Configuración de Turso (Usa variables de entorno en producción)
load_dotenv()

URL = os.getenv("TURSO_DATABASE_URL")
TOKEN = os.getenv("TURSO_AUTH_TOKEN")


def run_analysis():
    # 1. Adquisición de Datos
    client = create_client_sync(URL, auth_token=TOKEN)
    query = """
    SELECT a.id_actividad, a.es_aleatorio, n.topico,
           COUNT(i.id_intento) as total_intentos,
           AVG(i.puntaje_obtenido) as promedio_puntaje
    FROM actividad a
    JOIN nodo n ON a.id_nodo = n.id_nodo
    LEFT JOIN intento_actividad i ON a.id_actividad = i.id_actividad
    WHERE a.tipo_actividad = 'ejercicio'
    GROUP BY a.id_actividad
    """
    result = client.execute(query)
    df = pd.DataFrame(result.rows, columns=result.columns).fillna(0)
    client.close()

    # 2. Preprocesamiento
    df['categoria'] = df['es_aleatorio'].apply(lambda x: 'Examen' if x else 'Ejercicio')
    X_scaled = StandardScaler().fit_transform(df[['total_intentos', 'promedio_puntaje']])

    # 3. Modelado
    k = min(3, len(df))
    kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
    df['cluster'] = kmeans.fit_predict(X_scaled)

    # 4. Generar Gráfica (Guardar como imagen para el PDF)
    plt.figure(figsize=(10, 6))
    sns.scatterplot(data=df, x='total_intentos', y='promedio_puntaje', 
                    hue='cluster', style='categoria', palette='viridis', s=100)
    plot_path = "temp_plot.png"
    plt.savefig(plot_path)
    plt.close()

    # 5. Generar Recomendaciones
    recomms = []
    exam_criticos = df[(df['categoria'] == 'Examen') & (df['promedio_puntaje'] < 60)]
    if not exam_criticos.empty:
        recomms.append(f"Reforzar tópicos: {', '.join(exam_criticos['topico'].unique())}")
    
    return df, plot_path, recomms