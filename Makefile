deploy-provider:
	dfx canister --ic create --all
	dfx deploy --ic ic_siwe_provider --argument "( \
	    record { \
	        domain = \"vgxgm-maaaa-aaaap-abuva-cai.icp0.io\"; \
	        uri = \"https://umoqu-iqaaa-aaaap-ablxq-cai.icp0.io\"; \
	        salt = \"randomsalt123\"; \
	        chain_id = opt 1; \
	        scheme = opt \"http\"; \
	        statement = opt \"Login to the ICRC-1 wallet.\"; \
	        sign_in_expires_in = opt 300000000000; /* 5 minutes */ \
	        session_expires_in = opt 604800000000000; /* 1 week */ \
	    } \
	)"

deploy:
	dfx canister --ic create --all
	dfx deploy --ic assets
	dfx deploy --ic ic_siwe_provider --argument "( \
	    record { \
	        domain = \"vgxgm-maaaa-aaaap-abuva-cai.icp0.io\"; \
	        uri = \"https://umoqu-iqaaa-aaaap-ablxq-cai.icp0.io\"; \
	        salt = \"randomsalt123\"; \
	        chain_id = opt 1; \
	        scheme = opt \"http\"; \
	        statement = opt \"Login to the ICRC-1 wallet.\"; \
	        sign_in_expires_in = opt 300000000000; /* 5 minutes */ \
	        session_expires_in = opt 604800000000000; /* 1 week */ \
	    } \
	)"

deploy-local:
	dfx deploy assets
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