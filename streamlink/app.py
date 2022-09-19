import json
import re
import streamlink
from aws_lambda_types.api_gw import APIGWPayloadV2RequestDict


def handler(event: APIGWPayloadV2RequestDict, _):

    try:
        print("REQUEST: {}".format(json.dumps(event)))

        match = re.search("^\/live\/(.+)\/([^\/]+)\.(m3u8|mpd)$", event["rawPath"])

        print("CONFIG: {}", match.groups())

        protocol = "dash" if match.group(3) is "mpd" else "hls"
        streams = streamlink.streams(match.group(1))
        stream = streams[match.group(2)]

        return {
            "statusCode": 302,
            "headers": {
                "Content-Type": content_type(protocol),
                "Location": stream.url,
            },
        }
    except Exception as e:
        print(e)
        return {
            "statusCode": 404,
            "body": "NOT FOUND",
            "headers": {"Content-Type": "text/html"},
        }


def content_type(protocol: str) -> str:
    if protocol == "dash":
        return "video/vnd.mpeg.dash.mpd"

    return "application/vnd.apple.mpegurl"
