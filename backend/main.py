from typing import Union

from fastapi import FastAPI, Query
import apicall

from pydantic import BaseModel
import json

app = FastAPI()

class UserInput(BaseModel):
    user_input: str

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}


@app.post("/getAnswer")
def getResponse(user_input: UserInput):
    return {"response" :  json.loads(apicall.model_response_for_values(user_input))}


@app.get("/getSummaryOfPlaces")
def getSummary(place_type: str = Query(..., title="Place Type"), radius: str = Query(..., title="Radius")):
    return {"response" : (apicall.model_response_for_summary(place_type, radius))}