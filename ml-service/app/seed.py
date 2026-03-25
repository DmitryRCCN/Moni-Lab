import random
import uuid
import json
from datetime import datetime, timedelta
from libsql_client import create_client_sync
import os
from dotenv import load_dotenv

load_dotenv()

client = create_client_sync(
    os.getenv("TURSO_DATABASE_URL"),
    auth_token=os.getenv("TURSO_AUTH_TOKEN")
)

# --- CONFIGURACIÓN ---
nombres_base = ["Liam", "Emma", "Noah", "Olivia", "Mateo", "Sofia", "Lucas", "Isabella", "Leo", "Mia"]
apellidos_base = ["Garcia", "Martinez", "Lopez", "Hernandez", "Perez"]
perfiles = ["bueno", "persistente", "bajo"] 

def obtener_preguntas_reales(id_actividad, es_aleatorio, limite, topico=None, dif_min=1):
    """Busca preguntas que realmente existan en la DB para esa actividad"""
    if not es_aleatorio:
        res = client.execute("SELECT id_pregunta FROM ejercicio_pregunta WHERE id_actividad = ?", (id_actividad,))
    else:
        res = client.execute("SELECT id_pregunta FROM pregunta WHERE topico = ? AND nivel_dificultad >= ? LIMIT ?", (topico, dif_min, limite))
    
    return [r[0] for r in res.rows]

def poblar_todo(cantidad_estudiantes=30):
    # Obtenemos nodos (ignorando el título con _)
    nodos = client.execute("SELECT id_nodo, titulo, topico FROM nodo ORDER BY orden_secuencial").rows
    print(f"🚀 Iniciando población para {cantidad_estudiantes} estudiantes...")

    for i in range(cantidad_estudiantes):
        id_user = str(uuid.uuid4())
        perfil = random.choice(perfiles)
        nombre = f"{random.choice(nombres_base)} {random.choice(apellidos_base)} {i}"
        
        # 1. Crear Usuario
        client.execute("INSERT INTO usuarios (id, email, password, nombre, rol) VALUES (?, ?, ?, ?, ?)",
                      (id_user, f"user@test.com", "Ab12345678@", nombre, "estudiante"))

        # Empezamos la simulación hace 20 días
        fecha_simulada = datetime.now() - timedelta(days=20)

        for nodo in nodos:
            id_nodo, _, topico = nodo # '_' indica que no usamos titulo_nodo
            
            # Ajuste perfil bajo: 20% de probabilidad de saltarse este nodo (no rompe el curso)
            if perfil == "bajo" and random.random() < 0.2: 
                continue
            
            hizo_salto = False
            # Intentar examen de salto si el perfil es bueno
            if perfil == "bueno" and random.random() < 0.7:
                examen_salto = client.execute("""
                    SELECT a.id_actividad, e.jump_cantidad_preguntas, e.jump_dificultad_min 
                    FROM actividad a JOIN ejercicio e ON a.id_actividad = e.id_actividad 
                    WHERE a.id_nodo = ? AND e.es_de_salto = 1 LIMIT 1
                """, (id_nodo,)).rows

                if examen_salto:
                    id_act_salto, cant_p, dif_p = examen_salto[0]
                    preguntas = obtener_preguntas_reales(id_act_salto, True, cant_p, topico, dif_p)
                    
                    if preguntas:
                        puntaje = random.randint(85, 100)
                        detalle = [{"id": p, "correcta": True} for p in preguntas]
                        
                        client.execute("""
                            INSERT INTO intento_actividad (id_intento, id_usuario, id_actividad, puntaje_obtenido, detalle_respuestas, fecha_hora)
                            VALUES (?, ?, ?, ?, ?, ?)
                        """, (str(uuid.uuid4()), id_user, id_act_salto, puntaje, json.dumps(detalle), fecha_simulada.isoformat()))

                        client.execute("""
                            UPDATE progreso_actividad 
                            SET estado = 'completada', mejor_puntaje = ?, fecha_actualizacion = ?
                            WHERE id_usuario = ? AND id_actividad = ?
                        """, (puntaje, fecha_simulada.isoformat(), id_user, id_act_salto))
                        
                        hizo_salto = True

            if hizo_salto:
                fecha_simulada += timedelta(days=1)
                continue

            # --- PROGRESO NATURAL ---
            # Ahora traemos es_de_salto desde la tabla ejercicio para no depender del nombre del ID
            actividades = client.execute("""
                SELECT a.id_actividad, a.tipo_actividad, a.es_aleatorio, COALESCE(e.es_de_salto, 0) as es_de_salto
                FROM actividad a
                LEFT JOIN ejercicio e ON a.id_actividad = e.id_actividad
                WHERE a.id_nodo = ? 
                ORDER BY a.orden_secuencial
            """, (id_nodo,)).rows

            for act in actividades:
                id_act, tipo, es_aleatorio, es_de_salto = act
                
                # Si es un examen de salto, lo ignoramos (ya se intentó arriba o no aplica aquí)
                if es_de_salto: continue 

                fecha_simulada += timedelta(hours=random.randint(1, 4))

                if tipo == 'lectura':
                    client.execute("""
                        UPDATE progreso_actividad SET estado = 'completada', fecha_actualizacion = ?
                        WHERE id_usuario = ? AND id_actividad = ?
                    """, (fecha_simulada.isoformat(), id_user, id_act))
                
                elif tipo == 'ejercicio':
                    preguntas = obtener_preguntas_reales(id_act, es_aleatorio, 5, topico)
                    if not preguntas: continue
                    
                    # Puntajes según perfil
                    if perfil == "bueno": puntaje = random.randint(80, 100)
                    elif perfil == "persistente": puntaje = random.randint(60, 90)
                    else: puntaje = random.randint(30, 70) # bajo
                    
                    detalle = [{"id": p, "r": "simulada"} for p in preguntas]

                    client.execute("""
                        INSERT INTO intento_actividad (id_intento, id_usuario, id_actividad, puntaje_obtenido, detalle_respuestas, fecha_hora)
                        VALUES (?, ?, ?, ?, ?, ?)
                    """, (str(uuid.uuid4()), id_user, id_act, puntaje, json.dumps(detalle), fecha_simulada.isoformat()))

                    client.execute("""
                        UPDATE progreso_actividad 
                        SET estado = 'completada', mejor_puntaje = ?, fecha_actualizacion = ?
                        WHERE id_usuario = ? AND id_actividad = ?
                    """, (puntaje, fecha_simulada.isoformat(), id_user, id_act))

    print("✅ Población realista completada con triggers activos.")

if __name__ == "__main__":
    poblar_todo(cantidad_estudiantes=30)