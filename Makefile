deploy:
	dfx canister --ic create --all
	dfx deploy --ic assets
	dfx deploy --ic db
	dfx deploy --ic ic_siwe_provider --mode reinstall --argument "( \
	    record { \
	        domain = \"ic0.info\"; \
	        uri = \"https://wallet.ic0.info\"; \
	        salt = \"icrc1-wallet\"; \
	        chain_id = opt 1; \
	        scheme = opt \"https\"; \
	        statement = opt \"Login to the ICRC-1 wallet\"; \
	        sign_in_expires_in = opt 300000000000;  \
	        session_expires_in = opt 604800000000000;  \
	    } \
	)"

deploy-local:
	dfx canister create --all
	dfx deploy assets
	dfx deploy db
	dfx deploy ic_siwe_provider --argument "( \
	    record { \
	        domain = \"localhost\"; \
	        uri = \"http://localhost:3000\"; \
	        salt = \"icrc1-wallet\"; \
	        chain_id = opt 1; \
	        scheme = opt \"http\"; \
	        statement = opt \"Login to the ICRC-1 wallet\"; \
	        sign_in_expires_in = opt 300000000000;  \
	        session_expires_in = opt 604800000000000;  \
	    } \
	)"

deploy-siwe:
	dfx canister --ic create ic_siwe_provider
	dfx deploy --ic ic_siwe_provider --mode reinstall --argument "( \
	    record { \
	        domain = \"wallet.ic0.info\"; \
	        uri = \"https://wallet.ic0.info\"; \
	        salt = \"icrc1-wallet\"; \
	        chain_id = opt 1; \
	        scheme = opt \"https\"; \
	        statement = opt \"Login to the ICRC-1 wallet\"; \
	        sign_in_expires_in = opt 300000000000; /* 5 minutes */ \
	        session_expires_in = opt 604800000000000; /* 1 week */ \
	    } \
	)"	

deploy-siwe-local:
	dfx canister create ic_siwe_provider
	dfx deploy ic_siwe_provider --argument "( \
	    record { \
	        domain = \"localhost\"; \
	        uri = \"http://localhost:3000\"; \
	        salt = \"icrc1-wallet\"; \
	        chain_id = opt 1; \
	        scheme = opt \"http\"; \
	        statement = opt \"Login to the ICRC-1 wallet\"; \
	        sign_in_expires_in = opt 300000000000; /* 5 minutes */ \
	        session_expires_in = opt 604800000000000; /* 1 week */ \
	    } \
	)"
