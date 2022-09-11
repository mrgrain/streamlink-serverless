import json
import streamlink


def handler(event, context):
    print("request: {}".format(json.dumps(event)))

    streams = streamlink.streams(
        "hls://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_4x3/bipbop_4x3_variant.m3u8"
    )

    print("url: {}".format(streams["best"].url))

    return {
        "statusCode": 200,
        "headers": {"Content-Type": "text/plain"},
        "body": streams["best"].url,
    }
