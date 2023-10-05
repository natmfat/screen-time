# API specification
spec = """Website Classifier API


Request {
    method: GET | POST;
    pathname: "/api/predict";
    
    RequestBody {
        content: string;
    }

    ReponseQuery {
        content: string;
    }
    
    ResponseBody {
        success: boolean;
        message: string;
        prediction: string;
    }
}
"""

def response(success, message, prediction = None):
    res = {
        "success": success,
        "message": message,
    }

    if prediction is not None:
        res["prediction"] = prediction

    return res