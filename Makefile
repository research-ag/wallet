deploy-provider:
	dfx canister create --all
	dfx deploy ic_siwe_provider --argument "( \
	    record { \
	        domain = \"localhost\"; \
	        uri = \"http://localhost:3000\"; \
	        salt = \"randomsalt123\"; \
	        chain_id = opt 1; \
	        scheme = opt \"http\"; \
	        statement = opt \"Login to the ICRC-1 wallet.\"; \
	        sign_in_expires_in = opt 300000000000; /* 5 minutes */ \
	        session_expires_in = opt 604800000000000; /* 1 week */ \
	    } \
	)"
