"""
Single source of truth for the churn model's feature set.

train.py and main.py both import FEATURES (and the encoding/threshold constants) from
here directly, and feature_config.json is generated from build_feature_config() rather
than hand-written — add or change a feature here and every consumer follows, so the
model code, the serving code, and the exported config can't drift apart.
"""
from dataclasses import asdict, dataclass


@dataclass(frozen=True)
class Feature:
    key: str                       # column name in the model's feature vector
    request_field: str             # field name on the /predict request payload
    dtype: str                     # "int" | "float"
    min_value: float
    max_value: float
    whatif_default: float | None = None  # value the what-if simulator resets this input to


FEATURES: list[Feature] = [
    Feature("Account_Age_Days", "account_age_days", "int", 0, 3650),
    Feature("Daily_Usage_Mins", "daily_usage_mins", "int", 0, 1440, whatif_default=0),
    # login_frequency is a string on the request; login_freq_enc is its encoded form (below).
    Feature("login_freq_enc", "login_frequency", "int", 0, 2),
    # ticket_sentiment is derived from last_support_ticket via SENTIMENT_MAP, not sent directly.
    Feature("ticket_sentiment", "last_support_ticket", "float", -1.0, 1.0),
    Feature("days_since_last_login", "days_since_last_login", "int", 0, 3650, whatif_default=0),
    Feature(
        "core_feature_usage_percentage",
        "core_feature_usage_percentage",
        "float",
        0.0,
        100.0,
        whatif_default=100.0,
    ),
]

FEATURE_KEYS: list[str] = [f.key for f in FEATURES]

LOGIN_FREQ_ENCODING = {"Rarely": 0, "Weekly": 1, "Daily": 2}
DEFAULT_SENTIMENT = 0.0
THRESHOLD = 0.5


def build_feature_config() -> dict:
    """Serializable snapshot written to artifacts/*/feature_config.json."""
    return {
        "features": FEATURE_KEYS,
        "feature_schema": [asdict(f) for f in FEATURES],
        "login_freq_encoding": LOGIN_FREQ_ENCODING,
        "default_sentiment": DEFAULT_SENTIMENT,
        "threshold": THRESHOLD,
    }
