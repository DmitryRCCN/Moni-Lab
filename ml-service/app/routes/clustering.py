from fastapi import APIRouter

router = APIRouter()

@router.post('/cluster/users')
def cluster_users(payload: dict):
    return {"clusters": []}
