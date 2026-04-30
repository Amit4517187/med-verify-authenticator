import pytest
import os
import sys
from unittest.mock import MagicMock

# Mock heavy dependencies before importing app
sys.modules['easyocr'] = MagicMock()
tf_mock = MagicMock()
sys.modules['tensorflow'] = tf_mock
sys.modules['tensorflow.keras'] = MagicMock()
sys.modules['tensorflow.keras.models'] = MagicMock()
sys.modules['tensorflow.keras.preprocessing'] = MagicMock()
sys.modules['tensorflow.keras.preprocessing.image'] = MagicMock()

from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '../../med_verify_authenticator/.env'))

# Fallback values for tests if not in .env
if not os.getenv("MEDVERIFY_ACCESS_TOKEN"):
    os.environ["MEDVERIFY_ACCESS_TOKEN"] = "test-api-key"
if not os.getenv("BIGQUERY_PROJECT"):
    os.environ["BIGQUERY_PROJECT"] = "test-project"
if not os.getenv("GCP_JSON_KEY"):
    os.environ["GCP_JSON_KEY"] = '{"type": "service_account", "project_id": "test", "private_key_id": "123", "private_key": "---", "client_email": "test@test.com", "client_id": "123", "auth_uri": "---", "token_uri": "---", "auth_provider_x509_cert_url": "---", "client_x509_cert_url": "---"}'
if not os.getenv("GROQ_API_KEY"):
    os.environ["GROQ_API_KEY"] = "test-groq-key"

from app import app as flask_app

@pytest.fixture
def app():
    flask_app.config.update({
        "TESTING": True,
    })
    yield flask_app

@pytest.fixture
def client(app):
    return app.test_client()
