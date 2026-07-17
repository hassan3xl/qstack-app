

api_key = 'np_78abd405f43bd2e08deca4ebab2ac3aad3d15e02b2f70466'


import requests

response = requests.post(
    "https://notification.qstack.com.ng/api/v1/notifications/notify",
    headers={
        "X-API-Key": api_key,
        "Content-Type": "application/json"
    },
    json={
        "channel": "smokio",  # Target channel name
        "title": "System Alert",
        "body": "Your invoice has been processed successfully.",
        "payload": {
            "invoice_id": "inv_123",
            "amount": 29.99
        }
    }
)

print(response.json())