from flask import Response


def response_ok(response: Response) -> bool:
    return 200 <= response.status_code < 300


def status_code(response: Response, code: int) -> bool:
    return response.status_code == code