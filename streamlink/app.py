import json
import re
import streamlink
from aws_lambda_types.api_gw import APIGWPayloadV2RequestDict


def handler(event: APIGWPayloadV2RequestDict, _):

    try:
        print("REQUEST {}".format(json.dumps(event)))

        url = event["rawPath"]
        if event["rawQueryString"]:
            url += "?" + event["rawQueryString"]

        match = re.search("^\/live\/(.+?)(?:\/([^\/]+)\.(m3u8|mpd))?$", url)

        print("CONFIG", match.groups())

        protocol = "dash" if match.group(3) == "mpd" else "hls"
        streams = streamlink.streams(match.group(1))
        stream = streams[match.group(2) or "best"]

        result = {
            "statusCode": 302,
            "headers": {
                "Content-Type": content_type(protocol),
                "Location": stream.url,
            },
        }

        print("RETURN", result)
        return result

    except Exception as e:
        print("ERROR", e)
        return {
            "statusCode": 404,
            "body": "NOT FOUND",
            "headers": {"Content-Type": "text/html"},
        }


def content_type(protocol: str) -> str:
    if protocol == "dash":
        return "video/vnd.mpeg.dash.mpd"

    return "application/vnd.apple.mpegurl"
