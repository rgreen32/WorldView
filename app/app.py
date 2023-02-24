from app import app
import os

if __name__ == "__main__":
    cert_pem_path = os.getenv("CERT_CERT_PATH", "cert.pem")
    key_pem_path = os.getenv("KEY_CERT_PATH", "key.pem")

    app.run(host="0.0.0.0", ssl_context=(cert_pem_path, key_pem_path))