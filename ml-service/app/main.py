from fastapi import FastAPI

app = FastAPI()

@app.post('/ml/cluster/users')
def cluster_users(data: dict):
    # placeholder - devuelve estructura vacía
    return {"clusters": []}
