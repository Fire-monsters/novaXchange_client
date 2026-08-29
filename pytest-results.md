(venv) jjemba@Latitude:~/Alpha_pjts/nova_site/novaXchange_client$ python -m pytest Backend/services/catalog/tests
/home/jjemba/Alpha_pjts/nova_site/novaXchange_client/Backend/services/catalog/venv/lib/python3.12/site-packages/pytest_asyncio/plugin.py:208: PytestDeprecationWarning: The configuration option "asyncio_default_fixture_loop_scope" is unset.
The event loop scope for asynchronous fixtures will default to the fixture caching scope. Future versions of pytest-asyncio will default the loop scope for asynchronous fixtures to function scope. Set the default fixture loop scope explicitly in order to avoid unexpected behavior in the future. Valid fixture loop scopes are: "function", "class", "module", "package", "session"

  warnings.warn(PytestDeprecationWarning(_DEFAULT_FIXTURE_LOOP_SCOPE_UNSET))
============================================================= test session starts =============================================================
platform linux -- Python 3.12.3, pytest-8.3.3, pluggy-1.6.0
rootdir: /home/jjemba/Alpha_pjts/nova_site/novaXchange_client
plugins: anyio-4.14.2, asyncio-0.24.0
asyncio: mode=Mode.STRICT, default_loop_scope=None
collected 38 items                                                                                                                            

Backend/services/catalog/tests/test_admin_auth.py ....                                                                                  [ 10%]
Backend/services/catalog/tests/test_customer_auth.py FEFEFEFE.EFEFEFEFEFE.EFE.E.E                                                       [ 47%]
Backend/services/catalog/tests/test_orders.py FEFEFEFEFE.EFEFEFE.EFE.EFEFEFEFEFE                                                        [ 92%]
Backend/services/catalog/tests/test_store_settings.py FEFE.E                                                                            [100%]

=================================================================== ERRORS ====================================================================
____________________________________ ERROR at teardown of test_register_creates_account_and_returns_token _____________________________________

    @pytest.fixture
    def test_db():
        db_name = f"novaxchange_test_{uuid.uuid4().hex[:10]}"
        motor_client = AsyncIOMotorClient(MONGO_URI)
        db = motor_client[db_name]
        yield db
        motor_client.close()
>       pymongo.MongoClient(MONGO_URI).drop_database(db_name)

Backend/services/catalog/tests/test_customer_auth.py:24: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2236: in drop_database
    with self._conn_for_writes(session, operation=_Op.DROP_DATABASE) as conn:
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1666: in _conn_for_writes
    server = self._select_server(writable_server_selector, session, operation)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a916abfb747ae3ce7b3dd49, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = <function writable_server_selector at 0x7708907416c0>, timeout = 30, operation = <_Op.DROP_DATABASE: 'dropDatabase'>
operation_id = None, address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a916abfb747ae3ce7b3dd49, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
_______________________________________ ERROR at teardown of test_register_duplicate_email_returns_409 ________________________________________

    @pytest.fixture
    def test_db():
        db_name = f"novaxchange_test_{uuid.uuid4().hex[:10]}"
        motor_client = AsyncIOMotorClient(MONGO_URI)
        db = motor_client[db_name]
        yield db
        motor_client.close()
>       pymongo.MongoClient(MONGO_URI).drop_database(db_name)

Backend/services/catalog/tests/test_customer_auth.py:24: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2236: in drop_database
    with self._conn_for_writes(session, operation=_Op.DROP_DATABASE) as conn:
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1666: in _conn_for_writes
    server = self._select_server(writable_server_selector, session, operation)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a916afcb747ae3ce7b3dd4b, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = <function writable_server_selector at 0x7708907416c0>, timeout = 30, operation = <_Op.DROP_DATABASE: 'dropDatabase'>
operation_id = None, address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a916afcb747ae3ce7b3dd4b, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
_________________________________________ ERROR at teardown of test_login_wrong_password_returns_401 __________________________________________

    @pytest.fixture
    def test_db():
        db_name = f"novaxchange_test_{uuid.uuid4().hex[:10]}"
        motor_client = AsyncIOMotorClient(MONGO_URI)
        db = motor_client[db_name]
        yield db
        motor_client.close()
>       pymongo.MongoClient(MONGO_URI).drop_database(db_name)

Backend/services/catalog/tests/test_customer_auth.py:24: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2236: in drop_database
    with self._conn_for_writes(session, operation=_Op.DROP_DATABASE) as conn:
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1666: in _conn_for_writes
    server = self._select_server(writable_server_selector, session, operation)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a916b38b747ae3ce7b3dd4d, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = <function writable_server_selector at 0x7708907416c0>, timeout = 30, operation = <_Op.DROP_DATABASE: 'dropDatabase'>
operation_id = None, address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a916b38b747ae3ce7b3dd4d, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
_______________________________________ ERROR at teardown of test_login_correct_password_returns_token ________________________________________

    @pytest.fixture
    def test_db():
        db_name = f"novaxchange_test_{uuid.uuid4().hex[:10]}"
        motor_client = AsyncIOMotorClient(MONGO_URI)
        db = motor_client[db_name]
        yield db
        motor_client.close()
>       pymongo.MongoClient(MONGO_URI).drop_database(db_name)

Backend/services/catalog/tests/test_customer_auth.py:24: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2236: in drop_database
    with self._conn_for_writes(session, operation=_Op.DROP_DATABASE) as conn:
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1666: in _conn_for_writes
    server = self._select_server(writable_server_selector, session, operation)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a916b75b747ae3ce7b3dd4f, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = <function writable_server_selector at 0x7708907416c0>, timeout = 30, operation = <_Op.DROP_DATABASE: 'dropDatabase'>
operation_id = None, address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a916b75b747ae3ce7b3dd4f, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
_________________________________________________ ERROR at teardown of test_me_requires_token _________________________________________________

    @pytest.fixture
    def test_db():
        db_name = f"novaxchange_test_{uuid.uuid4().hex[:10]}"
        motor_client = AsyncIOMotorClient(MONGO_URI)
        db = motor_client[db_name]
        yield db
        motor_client.close()
>       pymongo.MongoClient(MONGO_URI).drop_database(db_name)

Backend/services/catalog/tests/test_customer_auth.py:24: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2236: in drop_database
    with self._conn_for_writes(session, operation=_Op.DROP_DATABASE) as conn:
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1666: in _conn_for_writes
    server = self._select_server(writable_server_selector, session, operation)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a916b93b747ae3ce7b3dd51, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = <function writable_server_selector at 0x7708907416c0>, timeout = 30, operation = <_Op.DROP_DATABASE: 'dropDatabase'>
operation_id = None, address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a916b93b747ae3ce7b3dd51, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
________________________________________________ ERROR at teardown of test_me_returns_profile _________________________________________________

    @pytest.fixture
    def test_db():
        db_name = f"novaxchange_test_{uuid.uuid4().hex[:10]}"
        motor_client = AsyncIOMotorClient(MONGO_URI)
        db = motor_client[db_name]
        yield db
        motor_client.close()
>       pymongo.MongoClient(MONGO_URI).drop_database(db_name)

Backend/services/catalog/tests/test_customer_auth.py:24: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2236: in drop_database
    with self._conn_for_writes(session, operation=_Op.DROP_DATABASE) as conn:
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1666: in _conn_for_writes
    server = self._select_server(writable_server_selector, session, operation)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a916bd0b747ae3ce7b3dd53, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = <function writable_server_selector at 0x7708907416c0>, timeout = 30, operation = <_Op.DROP_DATABASE: 'dropDatabase'>
operation_id = None, address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a916bd0b747ae3ce7b3dd53, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
_____________________________________________ ERROR at teardown of test_update_me_updates_profile _____________________________________________

    @pytest.fixture
    def test_db():
        db_name = f"novaxchange_test_{uuid.uuid4().hex[:10]}"
        motor_client = AsyncIOMotorClient(MONGO_URI)
        db = motor_client[db_name]
        yield db
        motor_client.close()
>       pymongo.MongoClient(MONGO_URI).drop_database(db_name)

Backend/services/catalog/tests/test_customer_auth.py:24: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2236: in drop_database
    with self._conn_for_writes(session, operation=_Op.DROP_DATABASE) as conn:
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1666: in _conn_for_writes
    server = self._select_server(writable_server_selector, session, operation)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a916c0db747ae3ce7b3dd55, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = <function writable_server_selector at 0x7708907416c0>, timeout = 30, operation = <_Op.DROP_DATABASE: 'dropDatabase'>
operation_id = None, address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a916c0db747ae3ce7b3dd55, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
___________________________________________ ERROR at teardown of test_google_auth_creates_new_user ____________________________________________

    @pytest.fixture
    def test_db():
        db_name = f"novaxchange_test_{uuid.uuid4().hex[:10]}"
        motor_client = AsyncIOMotorClient(MONGO_URI)
        db = motor_client[db_name]
        yield db
        motor_client.close()
>       pymongo.MongoClient(MONGO_URI).drop_database(db_name)

Backend/services/catalog/tests/test_customer_auth.py:24: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2236: in drop_database
    with self._conn_for_writes(session, operation=_Op.DROP_DATABASE) as conn:
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1666: in _conn_for_writes
    server = self._select_server(writable_server_selector, session, operation)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a916c49b747ae3ce7b3dd57, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = <function writable_server_selector at 0x7708907416c0>, timeout = 30, operation = <_Op.DROP_DATABASE: 'dropDatabase'>
operation_id = None, address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a916c49b747ae3ce7b3dd57, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
____________________________________ ERROR at teardown of test_google_auth_links_existing_password_account ____________________________________

    @pytest.fixture
    def test_db():
        db_name = f"novaxchange_test_{uuid.uuid4().hex[:10]}"
        motor_client = AsyncIOMotorClient(MONGO_URI)
        db = motor_client[db_name]
        yield db
        motor_client.close()
>       pymongo.MongoClient(MONGO_URI).drop_database(db_name)

Backend/services/catalog/tests/test_customer_auth.py:24: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2236: in drop_database
    with self._conn_for_writes(session, operation=_Op.DROP_DATABASE) as conn:
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1666: in _conn_for_writes
    server = self._select_server(writable_server_selector, session, operation)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a916c86b747ae3ce7b3dd59, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = <function writable_server_selector at 0x7708907416c0>, timeout = 30, operation = <_Op.DROP_DATABASE: 'dropDatabase'>
operation_id = None, address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a916c86b747ae3ce7b3dd59, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
__________________________________ ERROR at teardown of test_password_login_rejected_for_google_only_account __________________________________

    @pytest.fixture
    def test_db():
        db_name = f"novaxchange_test_{uuid.uuid4().hex[:10]}"
        motor_client = AsyncIOMotorClient(MONGO_URI)
        db = motor_client[db_name]
        yield db
        motor_client.close()
>       pymongo.MongoClient(MONGO_URI).drop_database(db_name)

Backend/services/catalog/tests/test_customer_auth.py:24: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2236: in drop_database
    with self._conn_for_writes(session, operation=_Op.DROP_DATABASE) as conn:
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1666: in _conn_for_writes
    server = self._select_server(writable_server_selector, session, operation)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a916cc2b747ae3ce7b3dd5b, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = <function writable_server_selector at 0x7708907416c0>, timeout = 30, operation = <_Op.DROP_DATABASE: 'dropDatabase'>
operation_id = None, address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a916cc2b747ae3ce7b3dd5b, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
____________________________________ ERROR at teardown of test_admin_token_rejected_by_customer_dependency ____________________________________

    @pytest.fixture
    def test_db():
        db_name = f"novaxchange_test_{uuid.uuid4().hex[:10]}"
        motor_client = AsyncIOMotorClient(MONGO_URI)
        db = motor_client[db_name]
        yield db
        motor_client.close()
>       pymongo.MongoClient(MONGO_URI).drop_database(db_name)

Backend/services/catalog/tests/test_customer_auth.py:24: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2236: in drop_database
    with self._conn_for_writes(session, operation=_Op.DROP_DATABASE) as conn:
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1666: in _conn_for_writes
    server = self._select_server(writable_server_selector, session, operation)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a916ce1b747ae3ce7b3dd5d, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = <function writable_server_selector at 0x7708907416c0>, timeout = 30, operation = <_Op.DROP_DATABASE: 'dropDatabase'>
operation_id = None, address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a916ce1b747ae3ce7b3dd5d, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
_____________________________________________ ERROR at teardown of test_admin_can_list_customers ______________________________________________

    @pytest.fixture
    def test_db():
        db_name = f"novaxchange_test_{uuid.uuid4().hex[:10]}"
        motor_client = AsyncIOMotorClient(MONGO_URI)
        db = motor_client[db_name]
        yield db
        motor_client.close()
>       pymongo.MongoClient(MONGO_URI).drop_database(db_name)

Backend/services/catalog/tests/test_customer_auth.py:24: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2236: in drop_database
    with self._conn_for_writes(session, operation=_Op.DROP_DATABASE) as conn:
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1666: in _conn_for_writes
    server = self._select_server(writable_server_selector, session, operation)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a916d1db747ae3ce7b3dd5f, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = <function writable_server_selector at 0x7708907416c0>, timeout = 30, operation = <_Op.DROP_DATABASE: 'dropDatabase'>
operation_id = None, address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a916d1db747ae3ce7b3dd5f, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
________________________________________ ERROR at teardown of test_list_customers_requires_admin_token ________________________________________

    @pytest.fixture
    def test_db():
        db_name = f"novaxchange_test_{uuid.uuid4().hex[:10]}"
        motor_client = AsyncIOMotorClient(MONGO_URI)
        db = motor_client[db_name]
        yield db
        motor_client.close()
>       pymongo.MongoClient(MONGO_URI).drop_database(db_name)

Backend/services/catalog/tests/test_customer_auth.py:24: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2236: in drop_database
    with self._conn_for_writes(session, operation=_Op.DROP_DATABASE) as conn:
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1666: in _conn_for_writes
    server = self._select_server(writable_server_selector, session, operation)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a916d3bb747ae3ce7b3dd61, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = <function writable_server_selector at 0x7708907416c0>, timeout = 30, operation = <_Op.DROP_DATABASE: 'dropDatabase'>
operation_id = None, address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a916d3bb747ae3ce7b3dd61, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
____________________________________ ERROR at teardown of test_customer_token_rejected_by_admin_dependency ____________________________________

    @pytest.fixture
    def test_db():
        db_name = f"novaxchange_test_{uuid.uuid4().hex[:10]}"
        motor_client = AsyncIOMotorClient(MONGO_URI)
        db = motor_client[db_name]
        yield db
        motor_client.close()
>       pymongo.MongoClient(MONGO_URI).drop_database(db_name)

Backend/services/catalog/tests/test_customer_auth.py:24: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2236: in drop_database
    with self._conn_for_writes(session, operation=_Op.DROP_DATABASE) as conn:
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1666: in _conn_for_writes
    server = self._select_server(writable_server_selector, session, operation)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a916d5ab747ae3ce7b3dd63, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = <function writable_server_selector at 0x7708907416c0>, timeout = 30, operation = <_Op.DROP_DATABASE: 'dropDatabase'>
operation_id = None, address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a916d5ab747ae3ce7b3dd63, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
___________________________________________ ERROR at teardown of test_create_order_decrements_stock ___________________________________________

    @pytest.fixture
    def test_db():
        """Yields the async Motor db used by the app (via dependency override).
        Test bodies that need to seed/inspect data directly use `sync_db()`
        below instead — mixing a synchronous asyncio.run()-style call against
        the Motor client with the TestClient's own event loop (which runs in a
        background thread via anyio's blocking portal) binds the client to two
        different loops and raises "attached to a different loop"."""
        db_name = f"novaxchange_test_{uuid.uuid4().hex[:10]}"
        motor_client = AsyncIOMotorClient(MONGO_URI)
        db = motor_client[db_name]
        yield db
        motor_client.close()
>       pymongo.MongoClient(MONGO_URI).drop_database(db_name)

Backend/services/catalog/tests/test_orders.py:31: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2236: in drop_database
    with self._conn_for_writes(session, operation=_Op.DROP_DATABASE) as conn:
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1666: in _conn_for_writes
    server = self._select_server(writable_server_selector, session, operation)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a916d96b747ae3ce7b3dd67, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = <function writable_server_selector at 0x7708907416c0>, timeout = 30, operation = <_Op.DROP_DATABASE: 'dropDatabase'>
operation_id = None, address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a916d96b747ae3ce7b3dd67, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
_________________________________________ ERROR at teardown of test_create_order_guest_has_no_user_id _________________________________________

    @pytest.fixture
    def test_db():
        """Yields the async Motor db used by the app (via dependency override).
        Test bodies that need to seed/inspect data directly use `sync_db()`
        below instead — mixing a synchronous asyncio.run()-style call against
        the Motor client with the TestClient's own event loop (which runs in a
        background thread via anyio's blocking portal) binds the client to two
        different loops and raises "attached to a different loop"."""
        db_name = f"novaxchange_test_{uuid.uuid4().hex[:10]}"
        motor_client = AsyncIOMotorClient(MONGO_URI)
        db = motor_client[db_name]
        yield db
        motor_client.close()
>       pymongo.MongoClient(MONGO_URI).drop_database(db_name)

Backend/services/catalog/tests/test_orders.py:31: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2236: in drop_database
    with self._conn_for_writes(session, operation=_Op.DROP_DATABASE) as conn:
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1666: in _conn_for_writes
    server = self._select_server(writable_server_selector, session, operation)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a916dd2b747ae3ce7b3dd6b, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = <function writable_server_selector at 0x7708907416c0>, timeout = 30, operation = <_Op.DROP_DATABASE: 'dropDatabase'>
operation_id = None, address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a916dd2b747ae3ce7b3dd6b, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
_______________________________________ ERROR at teardown of test_create_order_links_logged_in_customer _______________________________________

    @pytest.fixture
    def test_db():
        """Yields the async Motor db used by the app (via dependency override).
        Test bodies that need to seed/inspect data directly use `sync_db()`
        below instead — mixing a synchronous asyncio.run()-style call against
        the Motor client with the TestClient's own event loop (which runs in a
        background thread via anyio's blocking portal) binds the client to two
        different loops and raises "attached to a different loop"."""
        db_name = f"novaxchange_test_{uuid.uuid4().hex[:10]}"
        motor_client = AsyncIOMotorClient(MONGO_URI)
        db = motor_client[db_name]
        yield db
        motor_client.close()
>       pymongo.MongoClient(MONGO_URI).drop_database(db_name)

Backend/services/catalog/tests/test_orders.py:31: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2236: in drop_database
    with self._conn_for_writes(session, operation=_Op.DROP_DATABASE) as conn:
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1666: in _conn_for_writes
    server = self._select_server(writable_server_selector, session, operation)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a916e0fb747ae3ce7b3dd6f, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = <function writable_server_selector at 0x7708907416c0>, timeout = 30, operation = <_Op.DROP_DATABASE: 'dropDatabase'>
operation_id = None, address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a916e0fb747ae3ce7b3dd6f, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
__________________________________ ERROR at teardown of test_insufficient_stock_returns_422_with_no_mutation __________________________________

    @pytest.fixture
    def test_db():
        """Yields the async Motor db used by the app (via dependency override).
        Test bodies that need to seed/inspect data directly use `sync_db()`
        below instead — mixing a synchronous asyncio.run()-style call against
        the Motor client with the TestClient's own event loop (which runs in a
        background thread via anyio's blocking portal) binds the client to two
        different loops and raises "attached to a different loop"."""
        db_name = f"novaxchange_test_{uuid.uuid4().hex[:10]}"
        motor_client = AsyncIOMotorClient(MONGO_URI)
        db = motor_client[db_name]
        yield db
        motor_client.close()
>       pymongo.MongoClient(MONGO_URI).drop_database(db_name)

Backend/services/catalog/tests/test_orders.py:31: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2236: in drop_database
    with self._conn_for_writes(session, operation=_Op.DROP_DATABASE) as conn:
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1666: in _conn_for_writes
    server = self._select_server(writable_server_selector, session, operation)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a916e4bb747ae3ce7b3dd73, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = <function writable_server_selector at 0x7708907416c0>, timeout = 30, operation = <_Op.DROP_DATABASE: 'dropDatabase'>
operation_id = None, address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a916e4bb747ae3ce7b3dd73, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
_____________________________________________ ERROR at teardown of test_inactive_product_rejected _____________________________________________

    @pytest.fixture
    def test_db():
        """Yields the async Motor db used by the app (via dependency override).
        Test bodies that need to seed/inspect data directly use `sync_db()`
        below instead — mixing a synchronous asyncio.run()-style call against
        the Motor client with the TestClient's own event loop (which runs in a
        background thread via anyio's blocking portal) binds the client to two
        different loops and raises "attached to a different loop"."""
        db_name = f"novaxchange_test_{uuid.uuid4().hex[:10]}"
        motor_client = AsyncIOMotorClient(MONGO_URI)
        db = motor_client[db_name]
        yield db
        motor_client.close()
>       pymongo.MongoClient(MONGO_URI).drop_database(db_name)

Backend/services/catalog/tests/test_orders.py:31: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2236: in drop_database
    with self._conn_for_writes(session, operation=_Op.DROP_DATABASE) as conn:
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1666: in _conn_for_writes
    server = self._select_server(writable_server_selector, session, operation)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a916e88b747ae3ce7b3dd77, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = <function writable_server_selector at 0x7708907416c0>, timeout = 30, operation = <_Op.DROP_DATABASE: 'dropDatabase'>
operation_id = None, address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a916e88b747ae3ce7b3dd77, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
____________________________________________ ERROR at teardown of test_invalid_product_id_rejected ____________________________________________

    @pytest.fixture
    def test_db():
        """Yields the async Motor db used by the app (via dependency override).
        Test bodies that need to seed/inspect data directly use `sync_db()`
        below instead — mixing a synchronous asyncio.run()-style call against
        the Motor client with the TestClient's own event loop (which runs in a
        background thread via anyio's blocking portal) binds the client to two
        different loops and raises "attached to a different loop"."""
        db_name = f"novaxchange_test_{uuid.uuid4().hex[:10]}"
        motor_client = AsyncIOMotorClient(MONGO_URI)
        db = motor_client[db_name]
        yield db
        motor_client.close()
>       pymongo.MongoClient(MONGO_URI).drop_database(db_name)

Backend/services/catalog/tests/test_orders.py:31: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2236: in drop_database
    with self._conn_for_writes(session, operation=_Op.DROP_DATABASE) as conn:
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1666: in _conn_for_writes
    server = self._select_server(writable_server_selector, session, operation)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a916ea6b747ae3ce7b3dd79, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = <function writable_server_selector at 0x7708907416c0>, timeout = 30, operation = <_Op.DROP_DATABASE: 'dropDatabase'>
operation_id = None, address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a916ea6b747ae3ce7b3dd79, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
_____________________________________ ERROR at teardown of test_stock_race_rolls_back_earlier_decrements ______________________________________

    @pytest.fixture
    def test_db():
        """Yields the async Motor db used by the app (via dependency override).
        Test bodies that need to seed/inspect data directly use `sync_db()`
        below instead — mixing a synchronous asyncio.run()-style call against
        the Motor client with the TestClient's own event loop (which runs in a
        background thread via anyio's blocking portal) binds the client to two
        different loops and raises "attached to a different loop"."""
        db_name = f"novaxchange_test_{uuid.uuid4().hex[:10]}"
        motor_client = AsyncIOMotorClient(MONGO_URI)
        db = motor_client[db_name]
        yield db
        motor_client.close()
>       pymongo.MongoClient(MONGO_URI).drop_database(db_name)

Backend/services/catalog/tests/test_orders.py:31: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2236: in drop_database
    with self._conn_for_writes(session, operation=_Op.DROP_DATABASE) as conn:
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1666: in _conn_for_writes
    server = self._select_server(writable_server_selector, session, operation)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a916ee2b747ae3ce7b3dd7d, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = <function writable_server_selector at 0x7708907416c0>, timeout = 30, operation = <_Op.DROP_DATABASE: 'dropDatabase'>
operation_id = None, address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a916ee2b747ae3ce7b3dd7d, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
______________________________________ ERROR at teardown of test_guest_lookup_wrong_contact_returns_404 _______________________________________

    @pytest.fixture
    def test_db():
        """Yields the async Motor db used by the app (via dependency override).
        Test bodies that need to seed/inspect data directly use `sync_db()`
        below instead — mixing a synchronous asyncio.run()-style call against
        the Motor client with the TestClient's own event loop (which runs in a
        background thread via anyio's blocking portal) binds the client to two
        different loops and raises "attached to a different loop"."""
        db_name = f"novaxchange_test_{uuid.uuid4().hex[:10]}"
        motor_client = AsyncIOMotorClient(MONGO_URI)
        db = motor_client[db_name]
        yield db
        motor_client.close()
>       pymongo.MongoClient(MONGO_URI).drop_database(db_name)

Backend/services/catalog/tests/test_orders.py:31: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2236: in drop_database
    with self._conn_for_writes(session, operation=_Op.DROP_DATABASE) as conn:
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1666: in _conn_for_writes
    server = self._select_server(writable_server_selector, session, operation)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a916f1fb747ae3ce7b3dd81, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = <function writable_server_selector at 0x7708907416c0>, timeout = 30, operation = <_Op.DROP_DATABASE: 'dropDatabase'>
operation_id = None, address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a916f1fb747ae3ce7b3dd81, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
____________________________________ ERROR at teardown of test_guest_lookup_correct_contact_returns_order _____________________________________

    @pytest.fixture
    def test_db():
        """Yields the async Motor db used by the app (via dependency override).
        Test bodies that need to seed/inspect data directly use `sync_db()`
        below instead — mixing a synchronous asyncio.run()-style call against
        the Motor client with the TestClient's own event loop (which runs in a
        background thread via anyio's blocking portal) binds the client to two
        different loops and raises "attached to a different loop"."""
        db_name = f"novaxchange_test_{uuid.uuid4().hex[:10]}"
        motor_client = AsyncIOMotorClient(MONGO_URI)
        db = motor_client[db_name]
        yield db
        motor_client.close()
>       pymongo.MongoClient(MONGO_URI).drop_database(db_name)

Backend/services/catalog/tests/test_orders.py:31: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2236: in drop_database
    with self._conn_for_writes(session, operation=_Op.DROP_DATABASE) as conn:
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1666: in _conn_for_writes
    server = self._select_server(writable_server_selector, session, operation)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a916f5bb747ae3ce7b3dd85, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = <function writable_server_selector at 0x7708907416c0>, timeout = 30, operation = <_Op.DROP_DATABASE: 'dropDatabase'>
operation_id = None, address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a916f5bb747ae3ce7b3dd85, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
_________________________________________ ERROR at teardown of test_my_orders_requires_customer_token _________________________________________

    @pytest.fixture
    def test_db():
        """Yields the async Motor db used by the app (via dependency override).
        Test bodies that need to seed/inspect data directly use `sync_db()`
        below instead — mixing a synchronous asyncio.run()-style call against
        the Motor client with the TestClient's own event loop (which runs in a
        background thread via anyio's blocking portal) binds the client to two
        different loops and raises "attached to a different loop"."""
        db_name = f"novaxchange_test_{uuid.uuid4().hex[:10]}"
        motor_client = AsyncIOMotorClient(MONGO_URI)
        db = motor_client[db_name]
        yield db
        motor_client.close()
>       pymongo.MongoClient(MONGO_URI).drop_database(db_name)

Backend/services/catalog/tests/test_orders.py:31: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2236: in drop_database
    with self._conn_for_writes(session, operation=_Op.DROP_DATABASE) as conn:
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1666: in _conn_for_writes
    server = self._select_server(writable_server_selector, session, operation)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a916f79b747ae3ce7b3dd87, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = <function writable_server_selector at 0x7708907416c0>, timeout = 30, operation = <_Op.DROP_DATABASE: 'dropDatabase'>
operation_id = None, address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a916f79b747ae3ce7b3dd87, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
____________________________________________ ERROR at teardown of test_my_orders_lists_own_orders _____________________________________________

    @pytest.fixture
    def test_db():
        """Yields the async Motor db used by the app (via dependency override).
        Test bodies that need to seed/inspect data directly use `sync_db()`
        below instead — mixing a synchronous asyncio.run()-style call against
        the Motor client with the TestClient's own event loop (which runs in a
        background thread via anyio's blocking portal) binds the client to two
        different loops and raises "attached to a different loop"."""
        db_name = f"novaxchange_test_{uuid.uuid4().hex[:10]}"
        motor_client = AsyncIOMotorClient(MONGO_URI)
        db = motor_client[db_name]
        yield db
        motor_client.close()
>       pymongo.MongoClient(MONGO_URI).drop_database(db_name)

Backend/services/catalog/tests/test_orders.py:31: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2236: in drop_database
    with self._conn_for_writes(session, operation=_Op.DROP_DATABASE) as conn:
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1666: in _conn_for_writes
    server = self._select_server(writable_server_selector, session, operation)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a916fb6b747ae3ce7b3dd8b, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = <function writable_server_selector at 0x7708907416c0>, timeout = 30, operation = <_Op.DROP_DATABASE: 'dropDatabase'>
operation_id = None, address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a916fb6b747ae3ce7b3dd8b, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
_________________________________________ ERROR at teardown of test_admin_orders_requires_admin_token _________________________________________

    @pytest.fixture
    def test_db():
        """Yields the async Motor db used by the app (via dependency override).
        Test bodies that need to seed/inspect data directly use `sync_db()`
        below instead — mixing a synchronous asyncio.run()-style call against
        the Motor client with the TestClient's own event loop (which runs in a
        background thread via anyio's blocking portal) binds the client to two
        different loops and raises "attached to a different loop"."""
        db_name = f"novaxchange_test_{uuid.uuid4().hex[:10]}"
        motor_client = AsyncIOMotorClient(MONGO_URI)
        db = motor_client[db_name]
        yield db
        motor_client.close()
>       pymongo.MongoClient(MONGO_URI).drop_database(db_name)

Backend/services/catalog/tests/test_orders.py:31: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2236: in drop_database
    with self._conn_for_writes(session, operation=_Op.DROP_DATABASE) as conn:
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1666: in _conn_for_writes
    server = self._select_server(writable_server_selector, session, operation)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a916fd4b747ae3ce7b3dd8d, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = <function writable_server_selector at 0x7708907416c0>, timeout = 30, operation = <_Op.DROP_DATABASE: 'dropDatabase'>
operation_id = None, address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a916fd4b747ae3ce7b3dd8d, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
___________________________________________ ERROR at teardown of test_admin_can_list_and_view_order ___________________________________________

    @pytest.fixture
    def test_db():
        """Yields the async Motor db used by the app (via dependency override).
        Test bodies that need to seed/inspect data directly use `sync_db()`
        below instead — mixing a synchronous asyncio.run()-style call against
        the Motor client with the TestClient's own event loop (which runs in a
        background thread via anyio's blocking portal) binds the client to two
        different loops and raises "attached to a different loop"."""
        db_name = f"novaxchange_test_{uuid.uuid4().hex[:10]}"
        motor_client = AsyncIOMotorClient(MONGO_URI)
        db = motor_client[db_name]
        yield db
        motor_client.close()
>       pymongo.MongoClient(MONGO_URI).drop_database(db_name)

Backend/services/catalog/tests/test_orders.py:31: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2236: in drop_database
    with self._conn_for_writes(session, operation=_Op.DROP_DATABASE) as conn:
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1666: in _conn_for_writes
    server = self._select_server(writable_server_selector, session, operation)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a917010b747ae3ce7b3dd91, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = <function writable_server_selector at 0x7708907416c0>, timeout = 30, operation = <_Op.DROP_DATABASE: 'dropDatabase'>
operation_id = None, address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a917010b747ae3ce7b3dd91, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
_______________________________________ ERROR at teardown of test_valid_transition_pending_to_confirmed _______________________________________

    @pytest.fixture
    def test_db():
        """Yields the async Motor db used by the app (via dependency override).
        Test bodies that need to seed/inspect data directly use `sync_db()`
        below instead — mixing a synchronous asyncio.run()-style call against
        the Motor client with the TestClient's own event loop (which runs in a
        background thread via anyio's blocking portal) binds the client to two
        different loops and raises "attached to a different loop"."""
        db_name = f"novaxchange_test_{uuid.uuid4().hex[:10]}"
        motor_client = AsyncIOMotorClient(MONGO_URI)
        db = motor_client[db_name]
        yield db
        motor_client.close()
>       pymongo.MongoClient(MONGO_URI).drop_database(db_name)

Backend/services/catalog/tests/test_orders.py:31: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2236: in drop_database
    with self._conn_for_writes(session, operation=_Op.DROP_DATABASE) as conn:
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1666: in _conn_for_writes
    server = self._select_server(writable_server_selector, session, operation)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a91704db747ae3ce7b3dd95, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = <function writable_server_selector at 0x7708907416c0>, timeout = 30, operation = <_Op.DROP_DATABASE: 'dropDatabase'>
operation_id = None, address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a91704db747ae3ce7b3dd95, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
__________________________________ ERROR at teardown of test_invalid_transition_pending_to_shipped_rejected ___________________________________

    @pytest.fixture
    def test_db():
        """Yields the async Motor db used by the app (via dependency override).
        Test bodies that need to seed/inspect data directly use `sync_db()`
        below instead — mixing a synchronous asyncio.run()-style call against
        the Motor client with the TestClient's own event loop (which runs in a
        background thread via anyio's blocking portal) binds the client to two
        different loops and raises "attached to a different loop"."""
        db_name = f"novaxchange_test_{uuid.uuid4().hex[:10]}"
        motor_client = AsyncIOMotorClient(MONGO_URI)
        db = motor_client[db_name]
        yield db
        motor_client.close()
>       pymongo.MongoClient(MONGO_URI).drop_database(db_name)

Backend/services/catalog/tests/test_orders.py:31: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2236: in drop_database
    with self._conn_for_writes(session, operation=_Op.DROP_DATABASE) as conn:
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1666: in _conn_for_writes
    server = self._select_server(writable_server_selector, session, operation)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a917089b747ae3ce7b3dd99, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = <function writable_server_selector at 0x7708907416c0>, timeout = 30, operation = <_Op.DROP_DATABASE: 'dropDatabase'>
operation_id = None, address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a917089b747ae3ce7b3dd99, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
________________________________ ERROR at teardown of test_invalid_transition_from_terminal_delivered_rejected ________________________________

    @pytest.fixture
    def test_db():
        """Yields the async Motor db used by the app (via dependency override).
        Test bodies that need to seed/inspect data directly use `sync_db()`
        below instead — mixing a synchronous asyncio.run()-style call against
        the Motor client with the TestClient's own event loop (which runs in a
        background thread via anyio's blocking portal) binds the client to two
        different loops and raises "attached to a different loop"."""
        db_name = f"novaxchange_test_{uuid.uuid4().hex[:10]}"
        motor_client = AsyncIOMotorClient(MONGO_URI)
        db = motor_client[db_name]
        yield db
        motor_client.close()
>       pymongo.MongoClient(MONGO_URI).drop_database(db_name)

Backend/services/catalog/tests/test_orders.py:31: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2236: in drop_database
    with self._conn_for_writes(session, operation=_Op.DROP_DATABASE) as conn:
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1666: in _conn_for_writes
    server = self._select_server(writable_server_selector, session, operation)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a9170c6b747ae3ce7b3dd9d, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = <function writable_server_selector at 0x7708907416c0>, timeout = 30, operation = <_Op.DROP_DATABASE: 'dropDatabase'>
operation_id = None, address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a9170c6b747ae3ce7b3dd9d, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
_____________________________________ ERROR at teardown of test_cancellation_restores_stock_exactly_once ______________________________________

    @pytest.fixture
    def test_db():
        """Yields the async Motor db used by the app (via dependency override).
        Test bodies that need to seed/inspect data directly use `sync_db()`
        below instead — mixing a synchronous asyncio.run()-style call against
        the Motor client with the TestClient's own event loop (which runs in a
        background thread via anyio's blocking portal) binds the client to two
        different loops and raises "attached to a different loop"."""
        db_name = f"novaxchange_test_{uuid.uuid4().hex[:10]}"
        motor_client = AsyncIOMotorClient(MONGO_URI)
        db = motor_client[db_name]
        yield db
        motor_client.close()
>       pymongo.MongoClient(MONGO_URI).drop_database(db_name)

Backend/services/catalog/tests/test_orders.py:31: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2236: in drop_database
    with self._conn_for_writes(session, operation=_Op.DROP_DATABASE) as conn:
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1666: in _conn_for_writes
    server = self._select_server(writable_server_selector, session, operation)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a917102b747ae3ce7b3dda1, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = <function writable_server_selector at 0x7708907416c0>, timeout = 30, operation = <_Op.DROP_DATABASE: 'dropDatabase'>
operation_id = None, address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a917102b747ae3ce7b3dda1, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
_________________________________ ERROR at teardown of test_get_bundle_deals_defaults_to_disabled_when_unset __________________________________

    @pytest.fixture
    def test_db():
        db_name = f"novaxchange_test_{uuid.uuid4().hex[:10]}"
        motor_client = AsyncIOMotorClient(MONGO_URI)
        db = motor_client[db_name]
        yield db
        motor_client.close()
>       pymongo.MongoClient(MONGO_URI).drop_database(db_name)

Backend/services/catalog/tests/test_store_settings.py:24: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2236: in drop_database
    with self._conn_for_writes(session, operation=_Op.DROP_DATABASE) as conn:
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1666: in _conn_for_writes
    server = self._select_server(writable_server_selector, session, operation)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a91713fb747ae3ce7b3dda3, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = <function writable_server_selector at 0x7708907416c0>, timeout = 30, operation = <_Op.DROP_DATABASE: 'dropDatabase'>
operation_id = None, address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a91713fb747ae3ce7b3dda3, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
____________________________________ ERROR at teardown of test_admin_can_update_and_public_get_reflects_it ____________________________________

    @pytest.fixture
    def test_db():
        db_name = f"novaxchange_test_{uuid.uuid4().hex[:10]}"
        motor_client = AsyncIOMotorClient(MONGO_URI)
        db = motor_client[db_name]
        yield db
        motor_client.close()
>       pymongo.MongoClient(MONGO_URI).drop_database(db_name)

Backend/services/catalog/tests/test_store_settings.py:24: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2236: in drop_database
    with self._conn_for_writes(session, operation=_Op.DROP_DATABASE) as conn:
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1666: in _conn_for_writes
    server = self._select_server(writable_server_selector, session, operation)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a91717bb747ae3ce7b3dda5, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = <function writable_server_selector at 0x7708907416c0>, timeout = 30, operation = <_Op.DROP_DATABASE: 'dropDatabase'>
operation_id = None, address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a91717bb747ae3ce7b3dda5, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
_____________________________________ ERROR at teardown of test_update_bundle_deals_requires_admin_token ______________________________________

    @pytest.fixture
    def test_db():
        db_name = f"novaxchange_test_{uuid.uuid4().hex[:10]}"
        motor_client = AsyncIOMotorClient(MONGO_URI)
        db = motor_client[db_name]
        yield db
        motor_client.close()
>       pymongo.MongoClient(MONGO_URI).drop_database(db_name)

Backend/services/catalog/tests/test_store_settings.py:24: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2236: in drop_database
    with self._conn_for_writes(session, operation=_Op.DROP_DATABASE) as conn:
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1666: in _conn_for_writes
    server = self._select_server(writable_server_selector, session, operation)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a917199b747ae3ce7b3dda7, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = <function writable_server_selector at 0x7708907416c0>, timeout = 30, operation = <_Op.DROP_DATABASE: 'dropDatabase'>
operation_id = None, address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a917199b747ae3ce7b3dda7, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
================================================================== FAILURES ===================================================================
_______________________________________________ test_register_creates_account_and_returns_token _______________________________________________

client = <starlette.testclient.TestClient object at 0x77088f991760>

    def test_register_creates_account_and_returns_token(client):
>       response = _register(client)

Backend/services/catalog/tests/test_customer_auth.py:82: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/tests/test_customer_auth.py:75: in _register
    return client.post(
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/testclient.py:597: in post
    return super().post(
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:1132: in post
    return self.request(
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/testclient.py:488: in request
    return super().request(
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:814: in request
    return self.send(request, auth=auth, follow_redirects=follow_redirects)
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:901: in send
    response = self._send_handling_auth(
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:929: in _send_handling_auth
    response = self._send_handling_redirects(
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:966: in _send_handling_redirects
    response = self._send_single_request(request)
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:1002: in _send_single_request
    response = transport.handle_request(request)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/testclient.py:381: in handle_request
    raise exc
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/testclient.py:378: in handle_request
    portal.call(self.app, scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/anyio/from_thread.py:338: in call
    return cast(T_Retval, self.start_task_soon(func, *args).result())
/usr/lib/python3.12/concurrent/futures/_base.py:456: in result
    return self.__get_result()
/usr/lib/python3.12/concurrent/futures/_base.py:401: in __get_result
    raise self._exception
Backend/services/catalog/venv/lib/python3.12/site-packages/anyio/from_thread.py:263: in _call_func
    retval = await retval_or_awaitable
Backend/services/catalog/venv/lib/python3.12/site-packages/fastapi/applications.py:1054: in __call__
    await super().__call__(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/applications.py:113: in __call__
    await self.middleware_stack(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/middleware/errors.py:187: in __call__
    raise exc
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/middleware/errors.py:165: in __call__
    await self.app(scope, receive, _send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/middleware/exceptions.py:62: in __call__
    await wrap_app_handling_exceptions(self.app, conn)(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/_exception_handler.py:62: in wrapped_app
    raise exc
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/_exception_handler.py:51: in wrapped_app
    await app(scope, receive, sender)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:715: in __call__
    await self.middleware_stack(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:735: in app
    await route.handle(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:288: in handle
    await self.app(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:76: in app
    await wrap_app_handling_exceptions(app, request)(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/_exception_handler.py:62: in wrapped_app
    raise exc
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/_exception_handler.py:51: in wrapped_app
    await app(scope, receive, sender)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:73: in app
    response = await f(request)
Backend/services/catalog/venv/lib/python3.12/site-packages/fastapi/routing.py:301: in app
    raw_response = await run_endpoint_function(
Backend/services/catalog/venv/lib/python3.12/site-packages/fastapi/routing.py:212: in run_endpoint_function
    return await dependant.call(**values)
Backend/services/catalog/routers/auth/customer.py:117: in register
    if await db.users.find_one({"email": body.email}):
/usr/lib/python3.12/concurrent/futures/thread.py:58: in run
    result = self.fn(*self.args, **self.kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/collection.py:1709: in find_one
    for result in cursor.limit(-1):
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/cursor.py:1281: in __next__
    return self.next()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/cursor.py:1257: in next
    if len(self._data) or self._refresh():
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/cursor.py:1205: in _refresh
    self._send_message(q)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/cursor.py:1100: in _send_message
    response = client._run_operation(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1754: in _run_operation
    return self._retryable_read(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1863: in _retryable_read
    return self._retry_internal(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1830: in _retry_internal
    ).run()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2554: in run
    return self._read() if self._is_read else self._write()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2689: in _read
    self._server = self._get_server()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2645: in _get_server
    return self._client._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a916aa1b747ae3ce7b3dd48, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = Primary(), timeout = 30, operation = 'find', operation_id = None, address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a916aa1b747ae3ce7b3dd48, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
__________________________________________________ test_register_duplicate_email_returns_409 __________________________________________________

client = <starlette.testclient.TestClient object at 0x77088f9cdfa0>

    def test_register_duplicate_email_returns_409(client):
>       _register(client)

Backend/services/catalog/tests/test_customer_auth.py:90: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/tests/test_customer_auth.py:75: in _register
    return client.post(
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/testclient.py:597: in post
    return super().post(
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:1132: in post
    return self.request(
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/testclient.py:488: in request
    return super().request(
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:814: in request
    return self.send(request, auth=auth, follow_redirects=follow_redirects)
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:901: in send
    response = self._send_handling_auth(
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:929: in _send_handling_auth
    response = self._send_handling_redirects(
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:966: in _send_handling_redirects
    response = self._send_single_request(request)
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:1002: in _send_single_request
    response = transport.handle_request(request)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/testclient.py:381: in handle_request
    raise exc
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/testclient.py:378: in handle_request
    portal.call(self.app, scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/anyio/from_thread.py:338: in call
    return cast(T_Retval, self.start_task_soon(func, *args).result())
/usr/lib/python3.12/concurrent/futures/_base.py:456: in result
    return self.__get_result()
/usr/lib/python3.12/concurrent/futures/_base.py:401: in __get_result
    raise self._exception
Backend/services/catalog/venv/lib/python3.12/site-packages/anyio/from_thread.py:263: in _call_func
    retval = await retval_or_awaitable
Backend/services/catalog/venv/lib/python3.12/site-packages/fastapi/applications.py:1054: in __call__
    await super().__call__(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/applications.py:113: in __call__
    await self.middleware_stack(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/middleware/errors.py:187: in __call__
    raise exc
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/middleware/errors.py:165: in __call__
    await self.app(scope, receive, _send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/middleware/exceptions.py:62: in __call__
    await wrap_app_handling_exceptions(self.app, conn)(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/_exception_handler.py:62: in wrapped_app
    raise exc
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/_exception_handler.py:51: in wrapped_app
    await app(scope, receive, sender)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:715: in __call__
    await self.middleware_stack(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:735: in app
    await route.handle(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:288: in handle
    await self.app(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:76: in app
    await wrap_app_handling_exceptions(app, request)(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/_exception_handler.py:62: in wrapped_app
    raise exc
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/_exception_handler.py:51: in wrapped_app
    await app(scope, receive, sender)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:73: in app
    response = await f(request)
Backend/services/catalog/venv/lib/python3.12/site-packages/fastapi/routing.py:301: in app
    raw_response = await run_endpoint_function(
Backend/services/catalog/venv/lib/python3.12/site-packages/fastapi/routing.py:212: in run_endpoint_function
    return await dependant.call(**values)
Backend/services/catalog/routers/auth/customer.py:117: in register
    if await db.users.find_one({"email": body.email}):
/usr/lib/python3.12/concurrent/futures/thread.py:58: in run
    result = self.fn(*self.args, **self.kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/collection.py:1709: in find_one
    for result in cursor.limit(-1):
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/cursor.py:1281: in __next__
    return self.next()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/cursor.py:1257: in next
    if len(self._data) or self._refresh():
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/cursor.py:1205: in _refresh
    self._send_message(q)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/cursor.py:1100: in _send_message
    response = client._run_operation(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1754: in _run_operation
    return self._retryable_read(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1863: in _retryable_read
    return self._retry_internal(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1830: in _retry_internal
    ).run()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2554: in run
    return self._read() if self._is_read else self._write()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2689: in _read
    self._server = self._get_server()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2645: in _get_server
    return self._client._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a916addb747ae3ce7b3dd4a, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = Primary(), timeout = 30, operation = 'find', operation_id = None, address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a916addb747ae3ce7b3dd4a, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
____________________________________________________ test_login_wrong_password_returns_401 ____________________________________________________

client = <starlette.testclient.TestClient object at 0x77088ca83d40>

    def test_login_wrong_password_returns_401(client):
>       _register(client)

Backend/services/catalog/tests/test_customer_auth.py:96: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/tests/test_customer_auth.py:75: in _register
    return client.post(
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/testclient.py:597: in post
    return super().post(
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:1132: in post
    return self.request(
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/testclient.py:488: in request
    return super().request(
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:814: in request
    return self.send(request, auth=auth, follow_redirects=follow_redirects)
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:901: in send
    response = self._send_handling_auth(
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:929: in _send_handling_auth
    response = self._send_handling_redirects(
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:966: in _send_handling_redirects
    response = self._send_single_request(request)
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:1002: in _send_single_request
    response = transport.handle_request(request)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/testclient.py:381: in handle_request
    raise exc
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/testclient.py:378: in handle_request
    portal.call(self.app, scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/anyio/from_thread.py:338: in call
    return cast(T_Retval, self.start_task_soon(func, *args).result())
/usr/lib/python3.12/concurrent/futures/_base.py:456: in result
    return self.__get_result()
/usr/lib/python3.12/concurrent/futures/_base.py:401: in __get_result
    raise self._exception
Backend/services/catalog/venv/lib/python3.12/site-packages/anyio/from_thread.py:263: in _call_func
    retval = await retval_or_awaitable
Backend/services/catalog/venv/lib/python3.12/site-packages/fastapi/applications.py:1054: in __call__
    await super().__call__(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/applications.py:113: in __call__
    await self.middleware_stack(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/middleware/errors.py:187: in __call__
    raise exc
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/middleware/errors.py:165: in __call__
    await self.app(scope, receive, _send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/middleware/exceptions.py:62: in __call__
    await wrap_app_handling_exceptions(self.app, conn)(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/_exception_handler.py:62: in wrapped_app
    raise exc
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/_exception_handler.py:51: in wrapped_app
    await app(scope, receive, sender)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:715: in __call__
    await self.middleware_stack(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:735: in app
    await route.handle(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:288: in handle
    await self.app(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:76: in app
    await wrap_app_handling_exceptions(app, request)(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/_exception_handler.py:62: in wrapped_app
    raise exc
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/_exception_handler.py:51: in wrapped_app
    await app(scope, receive, sender)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:73: in app
    response = await f(request)
Backend/services/catalog/venv/lib/python3.12/site-packages/fastapi/routing.py:301: in app
    raw_response = await run_endpoint_function(
Backend/services/catalog/venv/lib/python3.12/site-packages/fastapi/routing.py:212: in run_endpoint_function
    return await dependant.call(**values)
Backend/services/catalog/routers/auth/customer.py:117: in register
    if await db.users.find_one({"email": body.email}):
/usr/lib/python3.12/concurrent/futures/thread.py:58: in run
    result = self.fn(*self.args, **self.kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/collection.py:1709: in find_one
    for result in cursor.limit(-1):
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/cursor.py:1281: in __next__
    return self.next()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/cursor.py:1257: in next
    if len(self._data) or self._refresh():
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/cursor.py:1205: in _refresh
    self._send_message(q)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/cursor.py:1100: in _send_message
    response = client._run_operation(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1754: in _run_operation
    return self._retryable_read(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1863: in _retryable_read
    return self._retry_internal(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1830: in _retry_internal
    ).run()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2554: in run
    return self._read() if self._is_read else self._write()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2689: in _read
    self._server = self._get_server()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2645: in _get_server
    return self._client._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a916b1ab747ae3ce7b3dd4c, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = Primary(), timeout = 30, operation = 'find', operation_id = None, address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a916b1ab747ae3ce7b3dd4c, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
__________________________________________________ test_login_correct_password_returns_token __________________________________________________

client = <starlette.testclient.TestClient object at 0x77088ca5c950>

    def test_login_correct_password_returns_token(client):
>       _register(client)

Backend/services/catalog/tests/test_customer_auth.py:105: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/tests/test_customer_auth.py:75: in _register
    return client.post(
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/testclient.py:597: in post
    return super().post(
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:1132: in post
    return self.request(
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/testclient.py:488: in request
    return super().request(
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:814: in request
    return self.send(request, auth=auth, follow_redirects=follow_redirects)
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:901: in send
    response = self._send_handling_auth(
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:929: in _send_handling_auth
    response = self._send_handling_redirects(
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:966: in _send_handling_redirects
    response = self._send_single_request(request)
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:1002: in _send_single_request
    response = transport.handle_request(request)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/testclient.py:381: in handle_request
    raise exc
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/testclient.py:378: in handle_request
    portal.call(self.app, scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/anyio/from_thread.py:338: in call
    return cast(T_Retval, self.start_task_soon(func, *args).result())
/usr/lib/python3.12/concurrent/futures/_base.py:456: in result
    return self.__get_result()
/usr/lib/python3.12/concurrent/futures/_base.py:401: in __get_result
    raise self._exception
Backend/services/catalog/venv/lib/python3.12/site-packages/anyio/from_thread.py:263: in _call_func
    retval = await retval_or_awaitable
Backend/services/catalog/venv/lib/python3.12/site-packages/fastapi/applications.py:1054: in __call__
    await super().__call__(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/applications.py:113: in __call__
    await self.middleware_stack(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/middleware/errors.py:187: in __call__
    raise exc
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/middleware/errors.py:165: in __call__
    await self.app(scope, receive, _send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/middleware/exceptions.py:62: in __call__
    await wrap_app_handling_exceptions(self.app, conn)(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/_exception_handler.py:62: in wrapped_app
    raise exc
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/_exception_handler.py:51: in wrapped_app
    await app(scope, receive, sender)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:715: in __call__
    await self.middleware_stack(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:735: in app
    await route.handle(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:288: in handle
    await self.app(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:76: in app
    await wrap_app_handling_exceptions(app, request)(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/_exception_handler.py:62: in wrapped_app
    raise exc
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/_exception_handler.py:51: in wrapped_app
    await app(scope, receive, sender)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:73: in app
    response = await f(request)
Backend/services/catalog/venv/lib/python3.12/site-packages/fastapi/routing.py:301: in app
    raw_response = await run_endpoint_function(
Backend/services/catalog/venv/lib/python3.12/site-packages/fastapi/routing.py:212: in run_endpoint_function
    return await dependant.call(**values)
Backend/services/catalog/routers/auth/customer.py:117: in register
    if await db.users.find_one({"email": body.email}):
/usr/lib/python3.12/concurrent/futures/thread.py:58: in run
    result = self.fn(*self.args, **self.kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/collection.py:1709: in find_one
    for result in cursor.limit(-1):
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/cursor.py:1281: in __next__
    return self.next()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/cursor.py:1257: in next
    if len(self._data) or self._refresh():
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/cursor.py:1205: in _refresh
    self._send_message(q)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/cursor.py:1100: in _send_message
    response = client._run_operation(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1754: in _run_operation
    return self._retryable_read(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1863: in _retryable_read
    return self._retry_internal(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1830: in _retry_internal
    ).run()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2554: in run
    return self._read() if self._is_read else self._write()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2689: in _read
    self._server = self._get_server()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2645: in _get_server
    return self._client._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a916b57b747ae3ce7b3dd4e, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = Primary(), timeout = 30, operation = 'find', operation_id = None, address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a916b57b747ae3ce7b3dd4e, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
___________________________________________________________ test_me_returns_profile ___________________________________________________________

client = <starlette.testclient.TestClient object at 0x77088d31ede0>

    def test_me_returns_profile(client):
>       token = _register(client).json()["access_token"]

Backend/services/catalog/tests/test_customer_auth.py:120: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/tests/test_customer_auth.py:75: in _register
    return client.post(
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/testclient.py:597: in post
    return super().post(
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:1132: in post
    return self.request(
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/testclient.py:488: in request
    return super().request(
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:814: in request
    return self.send(request, auth=auth, follow_redirects=follow_redirects)
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:901: in send
    response = self._send_handling_auth(
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:929: in _send_handling_auth
    response = self._send_handling_redirects(
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:966: in _send_handling_redirects
    response = self._send_single_request(request)
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:1002: in _send_single_request
    response = transport.handle_request(request)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/testclient.py:381: in handle_request
    raise exc
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/testclient.py:378: in handle_request
    portal.call(self.app, scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/anyio/from_thread.py:338: in call
    return cast(T_Retval, self.start_task_soon(func, *args).result())
/usr/lib/python3.12/concurrent/futures/_base.py:456: in result
    return self.__get_result()
/usr/lib/python3.12/concurrent/futures/_base.py:401: in __get_result
    raise self._exception
Backend/services/catalog/venv/lib/python3.12/site-packages/anyio/from_thread.py:263: in _call_func
    retval = await retval_or_awaitable
Backend/services/catalog/venv/lib/python3.12/site-packages/fastapi/applications.py:1054: in __call__
    await super().__call__(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/applications.py:113: in __call__
    await self.middleware_stack(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/middleware/errors.py:187: in __call__
    raise exc
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/middleware/errors.py:165: in __call__
    await self.app(scope, receive, _send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/middleware/exceptions.py:62: in __call__
    await wrap_app_handling_exceptions(self.app, conn)(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/_exception_handler.py:62: in wrapped_app
    raise exc
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/_exception_handler.py:51: in wrapped_app
    await app(scope, receive, sender)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:715: in __call__
    await self.middleware_stack(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:735: in app
    await route.handle(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:288: in handle
    await self.app(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:76: in app
    await wrap_app_handling_exceptions(app, request)(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/_exception_handler.py:62: in wrapped_app
    raise exc
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/_exception_handler.py:51: in wrapped_app
    await app(scope, receive, sender)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:73: in app
    response = await f(request)
Backend/services/catalog/venv/lib/python3.12/site-packages/fastapi/routing.py:301: in app
    raw_response = await run_endpoint_function(
Backend/services/catalog/venv/lib/python3.12/site-packages/fastapi/routing.py:212: in run_endpoint_function
    return await dependant.call(**values)
Backend/services/catalog/routers/auth/customer.py:117: in register
    if await db.users.find_one({"email": body.email}):
/usr/lib/python3.12/concurrent/futures/thread.py:58: in run
    result = self.fn(*self.args, **self.kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/collection.py:1709: in find_one
    for result in cursor.limit(-1):
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/cursor.py:1281: in __next__
    return self.next()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/cursor.py:1257: in next
    if len(self._data) or self._refresh():
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/cursor.py:1205: in _refresh
    self._send_message(q)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/cursor.py:1100: in _send_message
    response = client._run_operation(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1754: in _run_operation
    return self._retryable_read(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1863: in _retryable_read
    return self._retry_internal(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1830: in _retry_internal
    ).run()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2554: in run
    return self._read() if self._is_read else self._write()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2689: in _read
    self._server = self._get_server()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2645: in _get_server
    return self._client._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a916bb1b747ae3ce7b3dd52, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = Primary(), timeout = 30, operation = 'find', operation_id = None, address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a916bb1b747ae3ce7b3dd52, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
_______________________________________________________ test_update_me_updates_profile ________________________________________________________

client = <starlette.testclient.TestClient object at 0x77088cb3b230>

    def test_update_me_updates_profile(client):
>       token = _register(client).json()["access_token"]

Backend/services/catalog/tests/test_customer_auth.py:130: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/tests/test_customer_auth.py:75: in _register
    return client.post(
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/testclient.py:597: in post
    return super().post(
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:1132: in post
    return self.request(
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/testclient.py:488: in request
    return super().request(
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:814: in request
    return self.send(request, auth=auth, follow_redirects=follow_redirects)
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:901: in send
    response = self._send_handling_auth(
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:929: in _send_handling_auth
    response = self._send_handling_redirects(
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:966: in _send_handling_redirects
    response = self._send_single_request(request)
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:1002: in _send_single_request
    response = transport.handle_request(request)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/testclient.py:381: in handle_request
    raise exc
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/testclient.py:378: in handle_request
    portal.call(self.app, scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/anyio/from_thread.py:338: in call
    return cast(T_Retval, self.start_task_soon(func, *args).result())
/usr/lib/python3.12/concurrent/futures/_base.py:456: in result
    return self.__get_result()
/usr/lib/python3.12/concurrent/futures/_base.py:401: in __get_result
    raise self._exception
Backend/services/catalog/venv/lib/python3.12/site-packages/anyio/from_thread.py:263: in _call_func
    retval = await retval_or_awaitable
Backend/services/catalog/venv/lib/python3.12/site-packages/fastapi/applications.py:1054: in __call__
    await super().__call__(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/applications.py:113: in __call__
    await self.middleware_stack(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/middleware/errors.py:187: in __call__
    raise exc
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/middleware/errors.py:165: in __call__
    await self.app(scope, receive, _send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/middleware/exceptions.py:62: in __call__
    await wrap_app_handling_exceptions(self.app, conn)(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/_exception_handler.py:62: in wrapped_app
    raise exc
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/_exception_handler.py:51: in wrapped_app
    await app(scope, receive, sender)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:715: in __call__
    await self.middleware_stack(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:735: in app
    await route.handle(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:288: in handle
    await self.app(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:76: in app
    await wrap_app_handling_exceptions(app, request)(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/_exception_handler.py:62: in wrapped_app
    raise exc
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/_exception_handler.py:51: in wrapped_app
    await app(scope, receive, sender)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:73: in app
    response = await f(request)
Backend/services/catalog/venv/lib/python3.12/site-packages/fastapi/routing.py:301: in app
    raw_response = await run_endpoint_function(
Backend/services/catalog/venv/lib/python3.12/site-packages/fastapi/routing.py:212: in run_endpoint_function
    return await dependant.call(**values)
Backend/services/catalog/routers/auth/customer.py:117: in register
    if await db.users.find_one({"email": body.email}):
/usr/lib/python3.12/concurrent/futures/thread.py:58: in run
    result = self.fn(*self.args, **self.kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/collection.py:1709: in find_one
    for result in cursor.limit(-1):
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/cursor.py:1281: in __next__
    return self.next()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/cursor.py:1257: in next
    if len(self._data) or self._refresh():
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/cursor.py:1205: in _refresh
    self._send_message(q)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/cursor.py:1100: in _send_message
    response = client._run_operation(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1754: in _run_operation
    return self._retryable_read(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1863: in _retryable_read
    return self._retry_internal(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1830: in _retry_internal
    ).run()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2554: in run
    return self._read() if self._is_read else self._write()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2689: in _read
    self._server = self._get_server()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2645: in _get_server
    return self._client._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a916beeb747ae3ce7b3dd54, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = Primary(), timeout = 30, operation = 'find', operation_id = None, address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a916beeb747ae3ce7b3dd54, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
______________________________________________________ test_google_auth_creates_new_user ______________________________________________________

client = <starlette.testclient.TestClient object at 0x77088ca99340>, monkeypatch = <_pytest.monkeypatch.MonkeyPatch object at 0x77088ca82ae0>

    def test_google_auth_creates_new_user(client, monkeypatch):
        _mock_supabase_user(monkeypatch, payload={
            "id": "google-uid-1", "email": "newgoogle@example.com",
            "user_metadata": {"full_name": "Google User"},
        })
>       response = client.post("/account/google", json={"access_token": "fake-token"})

Backend/services/catalog/tests/test_customer_auth.py:147: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/testclient.py:597: in post
    return super().post(
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:1132: in post
    return self.request(
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/testclient.py:488: in request
    return super().request(
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:814: in request
    return self.send(request, auth=auth, follow_redirects=follow_redirects)
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:901: in send
    response = self._send_handling_auth(
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:929: in _send_handling_auth
    response = self._send_handling_redirects(
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:966: in _send_handling_redirects
    response = self._send_single_request(request)
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:1002: in _send_single_request
    response = transport.handle_request(request)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/testclient.py:381: in handle_request
    raise exc
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/testclient.py:378: in handle_request
    portal.call(self.app, scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/anyio/from_thread.py:338: in call
    return cast(T_Retval, self.start_task_soon(func, *args).result())
/usr/lib/python3.12/concurrent/futures/_base.py:456: in result
    return self.__get_result()
/usr/lib/python3.12/concurrent/futures/_base.py:401: in __get_result
    raise self._exception
Backend/services/catalog/venv/lib/python3.12/site-packages/anyio/from_thread.py:263: in _call_func
    retval = await retval_or_awaitable
Backend/services/catalog/venv/lib/python3.12/site-packages/fastapi/applications.py:1054: in __call__
    await super().__call__(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/applications.py:113: in __call__
    await self.middleware_stack(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/middleware/errors.py:187: in __call__
    raise exc
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/middleware/errors.py:165: in __call__
    await self.app(scope, receive, _send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/middleware/exceptions.py:62: in __call__
    await wrap_app_handling_exceptions(self.app, conn)(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/_exception_handler.py:62: in wrapped_app
    raise exc
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/_exception_handler.py:51: in wrapped_app
    await app(scope, receive, sender)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:715: in __call__
    await self.middleware_stack(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:735: in app
    await route.handle(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:288: in handle
    await self.app(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:76: in app
    await wrap_app_handling_exceptions(app, request)(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/_exception_handler.py:62: in wrapped_app
    raise exc
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/_exception_handler.py:51: in wrapped_app
    await app(scope, receive, sender)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:73: in app
    response = await f(request)
Backend/services/catalog/venv/lib/python3.12/site-packages/fastapi/routing.py:301: in app
    raw_response = await run_endpoint_function(
Backend/services/catalog/venv/lib/python3.12/site-packages/fastapi/routing.py:212: in run_endpoint_function
    return await dependant.call(**values)
Backend/services/catalog/routers/auth/customer.py:207: in google_auth
    user = await db.users.find_one({"email": email})
/usr/lib/python3.12/concurrent/futures/thread.py:58: in run
    result = self.fn(*self.args, **self.kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/collection.py:1709: in find_one
    for result in cursor.limit(-1):
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/cursor.py:1281: in __next__
    return self.next()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/cursor.py:1257: in next
    if len(self._data) or self._refresh():
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/cursor.py:1205: in _refresh
    self._send_message(q)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/cursor.py:1100: in _send_message
    response = client._run_operation(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1754: in _run_operation
    return self._retryable_read(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1863: in _retryable_read
    return self._retry_internal(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1830: in _retry_internal
    ).run()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2554: in run
    return self._read() if self._is_read else self._write()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2689: in _read
    self._server = self._get_server()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2645: in _get_server
    return self._client._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a916c2bb747ae3ce7b3dd56, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = Primary(), timeout = 30, operation = 'find', operation_id = None, address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a916c2bb747ae3ce7b3dd56, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
______________________________________________ test_google_auth_links_existing_password_account _______________________________________________

client = <starlette.testclient.TestClient object at 0x770890240650>
test_db = AsyncIOMotorDatabase(Database(MongoClient(host=['localhost:27017'], document_class=dict, tz_aware=False, connect=False, driver=DriverInfo(name='Motor', version='3.6.0', platform='asyncio')), 'novaxchange_test_23467ca243'))
monkeypatch = <_pytest.monkeypatch.MonkeyPatch object at 0x7708903e1d60>

    def test_google_auth_links_existing_password_account(client, test_db, monkeypatch):
>       _register(client, email="link@example.com")

Backend/services/catalog/tests/test_customer_auth.py:161: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/tests/test_customer_auth.py:75: in _register
    return client.post(
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/testclient.py:597: in post
    return super().post(
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:1132: in post
    return self.request(
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/testclient.py:488: in request
    return super().request(
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:814: in request
    return self.send(request, auth=auth, follow_redirects=follow_redirects)
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:901: in send
    response = self._send_handling_auth(
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:929: in _send_handling_auth
    response = self._send_handling_redirects(
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:966: in _send_handling_redirects
    response = self._send_single_request(request)
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:1002: in _send_single_request
    response = transport.handle_request(request)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/testclient.py:381: in handle_request
    raise exc
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/testclient.py:378: in handle_request
    portal.call(self.app, scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/anyio/from_thread.py:338: in call
    return cast(T_Retval, self.start_task_soon(func, *args).result())
/usr/lib/python3.12/concurrent/futures/_base.py:456: in result
    return self.__get_result()
/usr/lib/python3.12/concurrent/futures/_base.py:401: in __get_result
    raise self._exception
Backend/services/catalog/venv/lib/python3.12/site-packages/anyio/from_thread.py:263: in _call_func
    retval = await retval_or_awaitable
Backend/services/catalog/venv/lib/python3.12/site-packages/fastapi/applications.py:1054: in __call__
    await super().__call__(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/applications.py:113: in __call__
    await self.middleware_stack(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/middleware/errors.py:187: in __call__
    raise exc
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/middleware/errors.py:165: in __call__
    await self.app(scope, receive, _send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/middleware/exceptions.py:62: in __call__
    await wrap_app_handling_exceptions(self.app, conn)(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/_exception_handler.py:62: in wrapped_app
    raise exc
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/_exception_handler.py:51: in wrapped_app
    await app(scope, receive, sender)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:715: in __call__
    await self.middleware_stack(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:735: in app
    await route.handle(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:288: in handle
    await self.app(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:76: in app
    await wrap_app_handling_exceptions(app, request)(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/_exception_handler.py:62: in wrapped_app
    raise exc
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/_exception_handler.py:51: in wrapped_app
    await app(scope, receive, sender)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:73: in app
    response = await f(request)
Backend/services/catalog/venv/lib/python3.12/site-packages/fastapi/routing.py:301: in app
    raw_response = await run_endpoint_function(
Backend/services/catalog/venv/lib/python3.12/site-packages/fastapi/routing.py:212: in run_endpoint_function
    return await dependant.call(**values)
Backend/services/catalog/routers/auth/customer.py:117: in register
    if await db.users.find_one({"email": body.email}):
/usr/lib/python3.12/concurrent/futures/thread.py:58: in run
    result = self.fn(*self.args, **self.kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/collection.py:1709: in find_one
    for result in cursor.limit(-1):
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/cursor.py:1281: in __next__
    return self.next()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/cursor.py:1257: in next
    if len(self._data) or self._refresh():
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/cursor.py:1205: in _refresh
    self._send_message(q)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/cursor.py:1100: in _send_message
    response = client._run_operation(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1754: in _run_operation
    return self._retryable_read(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1863: in _retryable_read
    return self._retry_internal(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1830: in _retry_internal
    ).run()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2554: in run
    return self._read() if self._is_read else self._write()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2689: in _read
    self._server = self._get_server()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2645: in _get_server
    return self._client._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a916c67b747ae3ce7b3dd58, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = Primary(), timeout = 30, operation = 'find', operation_id = None, address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a916c67b747ae3ce7b3dd58, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
____________________________________________ test_password_login_rejected_for_google_only_account _____________________________________________

client = <starlette.testclient.TestClient object at 0x77088d335b80>, monkeypatch = <_pytest.monkeypatch.MonkeyPatch object at 0x77088d337410>

    def test_password_login_rejected_for_google_only_account(client, monkeypatch):
        _mock_supabase_user(monkeypatch, payload={
            "id": "google-uid-2", "email": "googleonly@example.com",
            "user_metadata": {"name": "Google Only"},
        })
>       client.post("/account/google", json={"access_token": "fake-token"})

Backend/services/catalog/tests/test_customer_auth.py:181: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/testclient.py:597: in post
    return super().post(
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:1132: in post
    return self.request(
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/testclient.py:488: in request
    return super().request(
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:814: in request
    return self.send(request, auth=auth, follow_redirects=follow_redirects)
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:901: in send
    response = self._send_handling_auth(
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:929: in _send_handling_auth
    response = self._send_handling_redirects(
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:966: in _send_handling_redirects
    response = self._send_single_request(request)
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:1002: in _send_single_request
    response = transport.handle_request(request)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/testclient.py:381: in handle_request
    raise exc
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/testclient.py:378: in handle_request
    portal.call(self.app, scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/anyio/from_thread.py:338: in call
    return cast(T_Retval, self.start_task_soon(func, *args).result())
/usr/lib/python3.12/concurrent/futures/_base.py:456: in result
    return self.__get_result()
/usr/lib/python3.12/concurrent/futures/_base.py:401: in __get_result
    raise self._exception
Backend/services/catalog/venv/lib/python3.12/site-packages/anyio/from_thread.py:263: in _call_func
    retval = await retval_or_awaitable
Backend/services/catalog/venv/lib/python3.12/site-packages/fastapi/applications.py:1054: in __call__
    await super().__call__(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/applications.py:113: in __call__
    await self.middleware_stack(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/middleware/errors.py:187: in __call__
    raise exc
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/middleware/errors.py:165: in __call__
    await self.app(scope, receive, _send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/middleware/exceptions.py:62: in __call__
    await wrap_app_handling_exceptions(self.app, conn)(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/_exception_handler.py:62: in wrapped_app
    raise exc
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/_exception_handler.py:51: in wrapped_app
    await app(scope, receive, sender)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:715: in __call__
    await self.middleware_stack(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:735: in app
    await route.handle(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:288: in handle
    await self.app(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:76: in app
    await wrap_app_handling_exceptions(app, request)(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/_exception_handler.py:62: in wrapped_app
    raise exc
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/_exception_handler.py:51: in wrapped_app
    await app(scope, receive, sender)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:73: in app
    response = await f(request)
Backend/services/catalog/venv/lib/python3.12/site-packages/fastapi/routing.py:301: in app
    raw_response = await run_endpoint_function(
Backend/services/catalog/venv/lib/python3.12/site-packages/fastapi/routing.py:212: in run_endpoint_function
    return await dependant.call(**values)
Backend/services/catalog/routers/auth/customer.py:207: in google_auth
    user = await db.users.find_one({"email": email})
/usr/lib/python3.12/concurrent/futures/thread.py:58: in run
    result = self.fn(*self.args, **self.kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/collection.py:1709: in find_one
    for result in cursor.limit(-1):
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/cursor.py:1281: in __next__
    return self.next()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/cursor.py:1257: in next
    if len(self._data) or self._refresh():
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/cursor.py:1205: in _refresh
    self._send_message(q)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/cursor.py:1100: in _send_message
    response = client._run_operation(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1754: in _run_operation
    return self._retryable_read(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1863: in _retryable_read
    return self._retry_internal(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1830: in _retry_internal
    ).run()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2554: in run
    return self._read() if self._is_read else self._write()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2689: in _read
    self._server = self._get_server()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2645: in _get_server
    return self._client._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a916ca4b747ae3ce7b3dd5a, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = Primary(), timeout = 30, operation = 'find', operation_id = None, address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a916ca4b747ae3ce7b3dd5a, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
________________________________________________________ test_admin_can_list_customers ________________________________________________________

test_db = AsyncIOMotorDatabase(Database(MongoClient(host=['localhost:27017'], document_class=dict, tz_aware=False, connect=False, driver=DriverInfo(name='Motor', version='3.6.0', platform='asyncio')), 'novaxchange_test_888eea9eb9'))
customer_settings = namespace(customer_jwt_secret='test-customer-secret', jwt_algorithm='HS256', customer_jwt_expire_minutes=60, admin_email='admin@example.com', supabase_url='https://test.supabase.co', supabase_anon_key='test-anon-key')
monkeypatch = <_pytest.monkeypatch.MonkeyPatch object at 0x7708903fffe0>

    def test_admin_can_list_customers(test_db, customer_settings, monkeypatch):
        admin_settings = SimpleNamespace(
            admin_email="admin@example.com",
            jwt_secret="test-admin-secret",
            jwt_algorithm="HS256",
            jwt_expire_minutes=60,
        )
        monkeypatch.setattr(admin_auth, "settings", admin_settings)
    
        app = FastAPI()
        app.include_router(admin_auth.router)
        app.include_router(customer_auth.router)
        app.include_router(customer_auth.admin_router)
        app.dependency_overrides[get_db] = lambda: test_db
    
        admin_tok = admin_auth.create_access_token({
            "sub": "admin@example.com", "role": "admin", "email": "admin@example.com",
        })
        with TestClient(app) as client:
>           client.post(
                "/account/register",
                json={"email": "a@example.com", "password": "Passw0rd!", "name": "A"},
            )

Backend/services/catalog/tests/test_customer_auth.py:233: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/testclient.py:597: in post
    return super().post(
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:1132: in post
    return self.request(
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/testclient.py:488: in request
    return super().request(
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:814: in request
    return self.send(request, auth=auth, follow_redirects=follow_redirects)
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:901: in send
    response = self._send_handling_auth(
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:929: in _send_handling_auth
    response = self._send_handling_redirects(
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:966: in _send_handling_redirects
    response = self._send_single_request(request)
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:1002: in _send_single_request
    response = transport.handle_request(request)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/testclient.py:381: in handle_request
    raise exc
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/testclient.py:378: in handle_request
    portal.call(self.app, scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/anyio/from_thread.py:338: in call
    return cast(T_Retval, self.start_task_soon(func, *args).result())
/usr/lib/python3.12/concurrent/futures/_base.py:456: in result
    return self.__get_result()
/usr/lib/python3.12/concurrent/futures/_base.py:401: in __get_result
    raise self._exception
Backend/services/catalog/venv/lib/python3.12/site-packages/anyio/from_thread.py:263: in _call_func
    retval = await retval_or_awaitable
Backend/services/catalog/venv/lib/python3.12/site-packages/fastapi/applications.py:1054: in __call__
    await super().__call__(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/applications.py:113: in __call__
    await self.middleware_stack(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/middleware/errors.py:187: in __call__
    raise exc
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/middleware/errors.py:165: in __call__
    await self.app(scope, receive, _send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/middleware/exceptions.py:62: in __call__
    await wrap_app_handling_exceptions(self.app, conn)(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/_exception_handler.py:62: in wrapped_app
    raise exc
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/_exception_handler.py:51: in wrapped_app
    await app(scope, receive, sender)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:715: in __call__
    await self.middleware_stack(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:735: in app
    await route.handle(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:288: in handle
    await self.app(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:76: in app
    await wrap_app_handling_exceptions(app, request)(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/_exception_handler.py:62: in wrapped_app
    raise exc
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/_exception_handler.py:51: in wrapped_app
    await app(scope, receive, sender)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:73: in app
    response = await f(request)
Backend/services/catalog/venv/lib/python3.12/site-packages/fastapi/routing.py:301: in app
    raw_response = await run_endpoint_function(
Backend/services/catalog/venv/lib/python3.12/site-packages/fastapi/routing.py:212: in run_endpoint_function
    return await dependant.call(**values)
Backend/services/catalog/routers/auth/customer.py:117: in register
    if await db.users.find_one({"email": body.email}):
/usr/lib/python3.12/concurrent/futures/thread.py:58: in run
    result = self.fn(*self.args, **self.kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/collection.py:1709: in find_one
    for result in cursor.limit(-1):
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/cursor.py:1281: in __next__
    return self.next()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/cursor.py:1257: in next
    if len(self._data) or self._refresh():
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/cursor.py:1205: in _refresh
    self._send_message(q)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/cursor.py:1100: in _send_message
    response = client._run_operation(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1754: in _run_operation
    return self._retryable_read(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1863: in _retryable_read
    return self._retry_internal(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1830: in _retry_internal
    ).run()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2554: in run
    return self._read() if self._is_read else self._write()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2689: in _read
    self._server = self._get_server()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2645: in _get_server
    return self._client._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a916cffb747ae3ce7b3dd5e, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = Primary(), timeout = 30, operation = 'find', operation_id = None, address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a916cffb747ae3ce7b3dd5e, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
_____________________________________________________ test_create_order_decrements_stock ______________________________________________________

client = <starlette.testclient.TestClient object at 0x77088d3edb20>
test_db = AsyncIOMotorDatabase(Database(MongoClient(host=['localhost:27017'], document_class=dict, tz_aware=False, connect=False, driver=DriverInfo(name='Motor', version='3.6.0', platform='asyncio')), 'novaxchange_test_0e4f75ac13'))

    def test_create_order_decrements_stock(client, test_db):
>       pid = seed_product(test_db, stock=5, price_ugx=10000)

Backend/services/catalog/tests/test_orders.py:127: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/tests/test_orders.py:101: in seed_product
    result = sync_db(test_db).products.insert_one(doc)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/collection.py:870: in insert_one
    self._insert_one(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/collection.py:810: in _insert_one
    self._database.client._retryable_write(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1898: in _retryable_write
    return self._retry_with_session(retryable, func, s, bulk, operation, operation_id)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1784: in _retry_with_session
    return self._retry_internal(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1830: in _retry_internal
    ).run()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2554: in run
    return self._read() if self._is_read else self._write()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2662: in _write
    self._server = self._get_server()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2645: in _get_server
    return self._client._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a916d78b747ae3ce7b3dd65, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = <function writable_server_selector at 0x7708907416c0>, timeout = 30, operation = <_Op.INSERT: 'insert'>, operation_id = None
address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a916d78b747ae3ce7b3dd65, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
___________________________________________________ test_create_order_guest_has_no_user_id ____________________________________________________

client = <starlette.testclient.TestClient object at 0x77088d3d57c0>
test_db = AsyncIOMotorDatabase(Database(MongoClient(host=['localhost:27017'], document_class=dict, tz_aware=False, connect=False, driver=DriverInfo(name='Motor', version='3.6.0', platform='asyncio')), 'novaxchange_test_7164096ea7'))

    def test_create_order_guest_has_no_user_id(client, test_db):
>       pid = seed_product(test_db, stock=5)

Backend/services/catalog/tests/test_orders.py:138: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/tests/test_orders.py:101: in seed_product
    result = sync_db(test_db).products.insert_one(doc)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/collection.py:870: in insert_one
    self._insert_one(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/collection.py:810: in _insert_one
    self._database.client._retryable_write(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1898: in _retryable_write
    return self._retry_with_session(retryable, func, s, bulk, operation, operation_id)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1784: in _retry_with_session
    return self._retry_internal(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1830: in _retry_internal
    ).run()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2554: in run
    return self._read() if self._is_read else self._write()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2662: in _write
    self._server = self._get_server()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2645: in _get_server
    return self._client._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a916db4b747ae3ce7b3dd69, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = <function writable_server_selector at 0x7708907416c0>, timeout = 30, operation = <_Op.INSERT: 'insert'>, operation_id = None
address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a916db4b747ae3ce7b3dd69, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
_________________________________________________ test_create_order_links_logged_in_customer __________________________________________________

client = <starlette.testclient.TestClient object at 0x77088d301c10>
test_db = AsyncIOMotorDatabase(Database(MongoClient(host=['localhost:27017'], document_class=dict, tz_aware=False, connect=False, driver=DriverInfo(name='Motor', version='3.6.0', platform='asyncio')), 'novaxchange_test_a7917784aa'))

    def test_create_order_links_logged_in_customer(client, test_db):
>       pid = seed_product(test_db, stock=5)

Backend/services/catalog/tests/test_orders.py:145: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/tests/test_orders.py:101: in seed_product
    result = sync_db(test_db).products.insert_one(doc)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/collection.py:870: in insert_one
    self._insert_one(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/collection.py:810: in _insert_one
    self._database.client._retryable_write(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1898: in _retryable_write
    return self._retry_with_session(retryable, func, s, bulk, operation, operation_id)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1784: in _retry_with_session
    return self._retry_internal(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1830: in _retry_internal
    ).run()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2554: in run
    return self._read() if self._is_read else self._write()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2662: in _write
    self._server = self._get_server()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2645: in _get_server
    return self._client._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a916df1b747ae3ce7b3dd6d, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = <function writable_server_selector at 0x7708907416c0>, timeout = 30, operation = <_Op.INSERT: 'insert'>, operation_id = None
address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a916df1b747ae3ce7b3dd6d, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
____________________________________________ test_insufficient_stock_returns_422_with_no_mutation _____________________________________________

client = <starlette.testclient.TestClient object at 0x77088c70c200>
test_db = AsyncIOMotorDatabase(Database(MongoClient(host=['localhost:27017'], document_class=dict, tz_aware=False, connect=False, driver=DriverInfo(name='Motor', version='3.6.0', platform='asyncio')), 'novaxchange_test_a05b8be137'))

    def test_insufficient_stock_returns_422_with_no_mutation(client, test_db):
>       pid_a = seed_product(test_db, name="A", slug="a", stock=1)

Backend/services/catalog/tests/test_orders.py:159: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/tests/test_orders.py:101: in seed_product
    result = sync_db(test_db).products.insert_one(doc)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/collection.py:870: in insert_one
    self._insert_one(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/collection.py:810: in _insert_one
    self._database.client._retryable_write(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1898: in _retryable_write
    return self._retry_with_session(retryable, func, s, bulk, operation, operation_id)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1784: in _retry_with_session
    return self._retry_internal(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1830: in _retry_internal
    ).run()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2554: in run
    return self._read() if self._is_read else self._write()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2662: in _write
    self._server = self._get_server()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2645: in _get_server
    return self._client._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a916e2db747ae3ce7b3dd71, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = <function writable_server_selector at 0x7708907416c0>, timeout = 30, operation = <_Op.INSERT: 'insert'>, operation_id = None
address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a916e2db747ae3ce7b3dd71, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
_______________________________________________________ test_inactive_product_rejected ________________________________________________________

client = <starlette.testclient.TestClient object at 0x77088d316c60>
test_db = AsyncIOMotorDatabase(Database(MongoClient(host=['localhost:27017'], document_class=dict, tz_aware=False, connect=False, driver=DriverInfo(name='Motor', version='3.6.0', platform='asyncio')), 'novaxchange_test_63444bbca0'))

    def test_inactive_product_rejected(client, test_db):
>       pid = seed_product(test_db, active=False, stock=5)

Backend/services/catalog/tests/test_orders.py:179: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/tests/test_orders.py:101: in seed_product
    result = sync_db(test_db).products.insert_one(doc)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/collection.py:870: in insert_one
    self._insert_one(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/collection.py:810: in _insert_one
    self._database.client._retryable_write(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1898: in _retryable_write
    return self._retry_with_session(retryable, func, s, bulk, operation, operation_id)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1784: in _retry_with_session
    return self._retry_internal(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1830: in _retry_internal
    ).run()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2554: in run
    return self._read() if self._is_read else self._write()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2662: in _write
    self._server = self._get_server()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2645: in _get_server
    return self._client._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a916e69b747ae3ce7b3dd75, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = <function writable_server_selector at 0x7708907416c0>, timeout = 30, operation = <_Op.INSERT: 'insert'>, operation_id = None
address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a916e69b747ae3ce7b3dd75, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
________________________________________________ test_stock_race_rolls_back_earlier_decrements ________________________________________________

test_db = AsyncIOMotorDatabase(Database(MongoClient(host=['localhost:27017'], document_class=dict, tz_aware=False, connect=False, driver=DriverInfo(name='Motor', version='3.6.0', platform='asyncio')), 'novaxchange_test_cdcb941a98'))
app_settings = None

    def test_stock_race_rolls_back_earlier_decrements(test_db, app_settings):
        """Simulates a genuine concurrent race: product A's guarded decrement
        succeeds for real, product B's is forced to report modified_count=0
        (as if another request won the race between validation and write).
        Asserts A's real stock is rolled back and B is left untouched."""
>       pid_a = seed_product(test_db, name="A", slug="a", stock=5)

Backend/services/catalog/tests/test_orders.py:194: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/tests/test_orders.py:101: in seed_product
    result = sync_db(test_db).products.insert_one(doc)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/collection.py:870: in insert_one
    self._insert_one(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/collection.py:810: in _insert_one
    self._database.client._retryable_write(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1898: in _retryable_write
    return self._retry_with_session(retryable, func, s, bulk, operation, operation_id)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1784: in _retry_with_session
    return self._retry_internal(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1830: in _retry_internal
    ).run()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2554: in run
    return self._read() if self._is_read else self._write()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2662: in _write
    self._server = self._get_server()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2645: in _get_server
    return self._client._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a916ec4b747ae3ce7b3dd7b, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = <function writable_server_selector at 0x7708907416c0>, timeout = 30, operation = <_Op.INSERT: 'insert'>, operation_id = None
address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a916ec4b747ae3ce7b3dd7b, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
_________________________________________________ test_guest_lookup_wrong_contact_returns_404 _________________________________________________

client = <starlette.testclient.TestClient object at 0x77088d3bd760>
test_db = AsyncIOMotorDatabase(Database(MongoClient(host=['localhost:27017'], document_class=dict, tz_aware=False, connect=False, driver=DriverInfo(name='Motor', version='3.6.0', platform='asyncio')), 'novaxchange_test_88f9257af6'))

    def test_guest_lookup_wrong_contact_returns_404(client, test_db):
>       pid = seed_product(test_db, stock=5)

Backend/services/catalog/tests/test_orders.py:248: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/tests/test_orders.py:101: in seed_product
    result = sync_db(test_db).products.insert_one(doc)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/collection.py:870: in insert_one
    self._insert_one(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/collection.py:810: in _insert_one
    self._database.client._retryable_write(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1898: in _retryable_write
    return self._retry_with_session(retryable, func, s, bulk, operation, operation_id)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1784: in _retry_with_session
    return self._retry_internal(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1830: in _retry_internal
    ).run()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2554: in run
    return self._read() if self._is_read else self._write()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2662: in _write
    self._server = self._get_server()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2645: in _get_server
    return self._client._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a916f00b747ae3ce7b3dd7f, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = <function writable_server_selector at 0x7708907416c0>, timeout = 30, operation = <_Op.INSERT: 'insert'>, operation_id = None
address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a916f00b747ae3ce7b3dd7f, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
_______________________________________________ test_guest_lookup_correct_contact_returns_order _______________________________________________

client = <starlette.testclient.TestClient object at 0x77088d3ee450>
test_db = AsyncIOMotorDatabase(Database(MongoClient(host=['localhost:27017'], document_class=dict, tz_aware=False, connect=False, driver=DriverInfo(name='Motor', version='3.6.0', platform='asyncio')), 'novaxchange_test_bc926621de'))

    def test_guest_lookup_correct_contact_returns_order(client, test_db):
>       pid = seed_product(test_db, stock=5)

Backend/services/catalog/tests/test_orders.py:255: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/tests/test_orders.py:101: in seed_product
    result = sync_db(test_db).products.insert_one(doc)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/collection.py:870: in insert_one
    self._insert_one(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/collection.py:810: in _insert_one
    self._database.client._retryable_write(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1898: in _retryable_write
    return self._retry_with_session(retryable, func, s, bulk, operation, operation_id)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1784: in _retry_with_session
    return self._retry_internal(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1830: in _retry_internal
    ).run()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2554: in run
    return self._read() if self._is_read else self._write()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2662: in _write
    self._server = self._get_server()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2645: in _get_server
    return self._client._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a916f3db747ae3ce7b3dd83, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = <function writable_server_selector at 0x7708907416c0>, timeout = 30, operation = <_Op.INSERT: 'insert'>, operation_id = None
address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a916f3db747ae3ce7b3dd83, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
_______________________________________________________ test_my_orders_lists_own_orders _______________________________________________________

client = <starlette.testclient.TestClient object at 0x77088d7904d0>
test_db = AsyncIOMotorDatabase(Database(MongoClient(host=['localhost:27017'], document_class=dict, tz_aware=False, connect=False, driver=DriverInfo(name='Motor', version='3.6.0', platform='asyncio')), 'novaxchange_test_1bca12fe5d'))

    def test_my_orders_lists_own_orders(client, test_db):
>       pid = seed_product(test_db, stock=5)

Backend/services/catalog/tests/test_orders.py:270: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/tests/test_orders.py:101: in seed_product
    result = sync_db(test_db).products.insert_one(doc)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/collection.py:870: in insert_one
    self._insert_one(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/collection.py:810: in _insert_one
    self._database.client._retryable_write(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1898: in _retryable_write
    return self._retry_with_session(retryable, func, s, bulk, operation, operation_id)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1784: in _retry_with_session
    return self._retry_internal(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1830: in _retry_internal
    ).run()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2554: in run
    return self._read() if self._is_read else self._write()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2662: in _write
    self._server = self._get_server()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2645: in _get_server
    return self._client._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a916f97b747ae3ce7b3dd89, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = <function writable_server_selector at 0x7708907416c0>, timeout = 30, operation = <_Op.INSERT: 'insert'>, operation_id = None
address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a916f97b747ae3ce7b3dd89, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
_____________________________________________________ test_admin_can_list_and_view_order ______________________________________________________

client = <starlette.testclient.TestClient object at 0x77088d880620>
test_db = AsyncIOMotorDatabase(Database(MongoClient(host=['localhost:27017'], document_class=dict, tz_aware=False, connect=False, driver=DriverInfo(name='Motor', version='3.6.0', platform='asyncio')), 'novaxchange_test_e3ce892494'))

    def test_admin_can_list_and_view_order(client, test_db):
>       pid = seed_product(test_db, stock=5)

Backend/services/catalog/tests/test_orders.py:289: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/tests/test_orders.py:101: in seed_product
    result = sync_db(test_db).products.insert_one(doc)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/collection.py:870: in insert_one
    self._insert_one(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/collection.py:810: in _insert_one
    self._database.client._retryable_write(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1898: in _retryable_write
    return self._retry_with_session(retryable, func, s, bulk, operation, operation_id)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1784: in _retry_with_session
    return self._retry_internal(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1830: in _retry_internal
    ).run()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2554: in run
    return self._read() if self._is_read else self._write()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2662: in _write
    self._server = self._get_server()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2645: in _get_server
    return self._client._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a916ff2b747ae3ce7b3dd8f, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = <function writable_server_selector at 0x7708907416c0>, timeout = 30, operation = <_Op.INSERT: 'insert'>, operation_id = None
address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a916ff2b747ae3ce7b3dd8f, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
_________________________________________________ test_valid_transition_pending_to_confirmed __________________________________________________

client = <starlette.testclient.TestClient object at 0x77088d7920c0>
test_db = AsyncIOMotorDatabase(Database(MongoClient(host=['localhost:27017'], document_class=dict, tz_aware=False, connect=False, driver=DriverInfo(name='Motor', version='3.6.0', platform='asyncio')), 'novaxchange_test_fe6e2fe24c'))

    def test_valid_transition_pending_to_confirmed(client, test_db):
>       order_id, _, token = _create_and_get_id(client, test_db)

Backend/services/catalog/tests/test_orders.py:314: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/tests/test_orders.py:305: in _create_and_get_id
    pid = seed_product(test_db, stock=stock)
Backend/services/catalog/tests/test_orders.py:101: in seed_product
    result = sync_db(test_db).products.insert_one(doc)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/collection.py:870: in insert_one
    self._insert_one(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/collection.py:810: in _insert_one
    self._database.client._retryable_write(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1898: in _retryable_write
    return self._retry_with_session(retryable, func, s, bulk, operation, operation_id)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1784: in _retry_with_session
    return self._retry_internal(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1830: in _retry_internal
    ).run()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2554: in run
    return self._read() if self._is_read else self._write()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2662: in _write
    self._server = self._get_server()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2645: in _get_server
    return self._client._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a91702fb747ae3ce7b3dd93, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = <function writable_server_selector at 0x7708907416c0>, timeout = 30, operation = <_Op.INSERT: 'insert'>, operation_id = None
address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a91702fb747ae3ce7b3dd93, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
_____________________________________________ test_invalid_transition_pending_to_shipped_rejected _____________________________________________

client = <starlette.testclient.TestClient object at 0x77088f9b2d50>
test_db = AsyncIOMotorDatabase(Database(MongoClient(host=['localhost:27017'], document_class=dict, tz_aware=False, connect=False, driver=DriverInfo(name='Motor', version='3.6.0', platform='asyncio')), 'novaxchange_test_2d50af4c8a'))

    def test_invalid_transition_pending_to_shipped_rejected(client, test_db):
>       order_id, _, token = _create_and_get_id(client, test_db)

Backend/services/catalog/tests/test_orders.py:325: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/tests/test_orders.py:305: in _create_and_get_id
    pid = seed_product(test_db, stock=stock)
Backend/services/catalog/tests/test_orders.py:101: in seed_product
    result = sync_db(test_db).products.insert_one(doc)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/collection.py:870: in insert_one
    self._insert_one(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/collection.py:810: in _insert_one
    self._database.client._retryable_write(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1898: in _retryable_write
    return self._retry_with_session(retryable, func, s, bulk, operation, operation_id)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1784: in _retry_with_session
    return self._retry_internal(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1830: in _retry_internal
    ).run()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2554: in run
    return self._read() if self._is_read else self._write()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2662: in _write
    self._server = self._get_server()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2645: in _get_server
    return self._client._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a91706bb747ae3ce7b3dd97, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = <function writable_server_selector at 0x7708907416c0>, timeout = 30, operation = <_Op.INSERT: 'insert'>, operation_id = None
address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a91706bb747ae3ce7b3dd97, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
__________________________________________ test_invalid_transition_from_terminal_delivered_rejected ___________________________________________

client = <starlette.testclient.TestClient object at 0x77088d337920>
test_db = AsyncIOMotorDatabase(Database(MongoClient(host=['localhost:27017'], document_class=dict, tz_aware=False, connect=False, driver=DriverInfo(name='Motor', version='3.6.0', platform='asyncio')), 'novaxchange_test_c9da1cbe09'))

    def test_invalid_transition_from_terminal_delivered_rejected(client, test_db):
>       order_id, _, token = _create_and_get_id(client, test_db)

Backend/services/catalog/tests/test_orders.py:335: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/tests/test_orders.py:305: in _create_and_get_id
    pid = seed_product(test_db, stock=stock)
Backend/services/catalog/tests/test_orders.py:101: in seed_product
    result = sync_db(test_db).products.insert_one(doc)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/collection.py:870: in insert_one
    self._insert_one(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/collection.py:810: in _insert_one
    self._database.client._retryable_write(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1898: in _retryable_write
    return self._retry_with_session(retryable, func, s, bulk, operation, operation_id)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1784: in _retry_with_session
    return self._retry_internal(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1830: in _retry_internal
    ).run()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2554: in run
    return self._read() if self._is_read else self._write()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2662: in _write
    self._server = self._get_server()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2645: in _get_server
    return self._client._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a9170a7b747ae3ce7b3dd9b, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = <function writable_server_selector at 0x7708907416c0>, timeout = 30, operation = <_Op.INSERT: 'insert'>, operation_id = None
address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a9170a7b747ae3ce7b3dd9b, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
________________________________________________ test_cancellation_restores_stock_exactly_once ________________________________________________

client = <starlette.testclient.TestClient object at 0x77088f9cc830>
test_db = AsyncIOMotorDatabase(Database(MongoClient(host=['localhost:27017'], document_class=dict, tz_aware=False, connect=False, driver=DriverInfo(name='Motor', version='3.6.0', platform='asyncio')), 'novaxchange_test_99b15784a2'))

    def test_cancellation_restores_stock_exactly_once(client, test_db):
>       order_id, pid, token = _create_and_get_id(client, test_db, stock=5)

Backend/services/catalog/tests/test_orders.py:352: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/tests/test_orders.py:305: in _create_and_get_id
    pid = seed_product(test_db, stock=stock)
Backend/services/catalog/tests/test_orders.py:101: in seed_product
    result = sync_db(test_db).products.insert_one(doc)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/collection.py:870: in insert_one
    self._insert_one(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/collection.py:810: in _insert_one
    self._database.client._retryable_write(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1898: in _retryable_write
    return self._retry_with_session(retryable, func, s, bulk, operation, operation_id)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1784: in _retry_with_session
    return self._retry_internal(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1830: in _retry_internal
    ).run()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2554: in run
    return self._read() if self._is_read else self._write()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2662: in _write
    self._server = self._get_server()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2645: in _get_server
    return self._client._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a9170e4b747ae3ce7b3dd9f, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = <function writable_server_selector at 0x7708907416c0>, timeout = 30, operation = <_Op.INSERT: 'insert'>, operation_id = None
address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a9170e4b747ae3ce7b3dd9f, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
____________________________________________ test_get_bundle_deals_defaults_to_disabled_when_unset ____________________________________________

client = <starlette.testclient.TestClient object at 0x77088c70b5f0>

    def test_get_bundle_deals_defaults_to_disabled_when_unset(client):
>       response = client.get("/settings/bundle-deals")

Backend/services/catalog/tests/test_store_settings.py:80: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/testclient.py:518: in get
    return super().get(
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:1041: in get
    return self.request(
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/testclient.py:488: in request
    return super().request(
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:814: in request
    return self.send(request, auth=auth, follow_redirects=follow_redirects)
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:901: in send
    response = self._send_handling_auth(
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:929: in _send_handling_auth
    response = self._send_handling_redirects(
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:966: in _send_handling_redirects
    response = self._send_single_request(request)
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:1002: in _send_single_request
    response = transport.handle_request(request)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/testclient.py:381: in handle_request
    raise exc
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/testclient.py:378: in handle_request
    portal.call(self.app, scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/anyio/from_thread.py:338: in call
    return cast(T_Retval, self.start_task_soon(func, *args).result())
/usr/lib/python3.12/concurrent/futures/_base.py:456: in result
    return self.__get_result()
/usr/lib/python3.12/concurrent/futures/_base.py:401: in __get_result
    raise self._exception
Backend/services/catalog/venv/lib/python3.12/site-packages/anyio/from_thread.py:263: in _call_func
    retval = await retval_or_awaitable
Backend/services/catalog/venv/lib/python3.12/site-packages/fastapi/applications.py:1054: in __call__
    await super().__call__(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/applications.py:113: in __call__
    await self.middleware_stack(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/middleware/errors.py:187: in __call__
    raise exc
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/middleware/errors.py:165: in __call__
    await self.app(scope, receive, _send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/middleware/exceptions.py:62: in __call__
    await wrap_app_handling_exceptions(self.app, conn)(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/_exception_handler.py:62: in wrapped_app
    raise exc
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/_exception_handler.py:51: in wrapped_app
    await app(scope, receive, sender)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:715: in __call__
    await self.middleware_stack(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:735: in app
    await route.handle(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:288: in handle
    await self.app(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:76: in app
    await wrap_app_handling_exceptions(app, request)(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/_exception_handler.py:62: in wrapped_app
    raise exc
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/_exception_handler.py:51: in wrapped_app
    await app(scope, receive, sender)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:73: in app
    response = await f(request)
Backend/services/catalog/venv/lib/python3.12/site-packages/fastapi/routing.py:301: in app
    raw_response = await run_endpoint_function(
Backend/services/catalog/venv/lib/python3.12/site-packages/fastapi/routing.py:212: in run_endpoint_function
    return await dependant.call(**values)
Backend/services/catalog/routers/products/store_settings.py:30: in get_bundle_deals
    doc = await db.settings.find_one({"_id": SETTINGS_ID})
/usr/lib/python3.12/concurrent/futures/thread.py:58: in run
    result = self.fn(*self.args, **self.kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/collection.py:1709: in find_one
    for result in cursor.limit(-1):
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/cursor.py:1281: in __next__
    return self.next()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/cursor.py:1257: in next
    if len(self._data) or self._refresh():
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/cursor.py:1205: in _refresh
    self._send_message(q)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/cursor.py:1100: in _send_message
    response = client._run_operation(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1754: in _run_operation
    return self._retryable_read(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1863: in _retryable_read
    return self._retry_internal(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1830: in _retry_internal
    ).run()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2554: in run
    return self._read() if self._is_read else self._write()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2689: in _read
    self._server = self._get_server()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2645: in _get_server
    return self._client._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a917120b747ae3ce7b3dda2, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = Primary(), timeout = 30, operation = 'find', operation_id = None, address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a917120b747ae3ce7b3dda2, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
______________________________________________ test_admin_can_update_and_public_get_reflects_it _______________________________________________

client = <starlette.testclient.TestClient object at 0x77088d31e3c0>

    def test_admin_can_update_and_public_get_reflects_it(client):
>       put_response = client.put(
            "/admin/settings/bundle-deals",
            headers={"Authorization": f"Bearer {_admin_token()}"},
            json=SAMPLE_PAYLOAD,
        )

Backend/services/catalog/tests/test_store_settings.py:88: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/testclient.py:630: in put
    return super().put(
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:1169: in put
    return self.request(
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/testclient.py:488: in request
    return super().request(
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:814: in request
    return self.send(request, auth=auth, follow_redirects=follow_redirects)
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:901: in send
    response = self._send_handling_auth(
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:929: in _send_handling_auth
    response = self._send_handling_redirects(
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:966: in _send_handling_redirects
    response = self._send_single_request(request)
Backend/services/catalog/venv/lib/python3.12/site-packages/httpx/_client.py:1002: in _send_single_request
    response = transport.handle_request(request)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/testclient.py:381: in handle_request
    raise exc
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/testclient.py:378: in handle_request
    portal.call(self.app, scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/anyio/from_thread.py:338: in call
    return cast(T_Retval, self.start_task_soon(func, *args).result())
/usr/lib/python3.12/concurrent/futures/_base.py:456: in result
    return self.__get_result()
/usr/lib/python3.12/concurrent/futures/_base.py:401: in __get_result
    raise self._exception
Backend/services/catalog/venv/lib/python3.12/site-packages/anyio/from_thread.py:263: in _call_func
    retval = await retval_or_awaitable
Backend/services/catalog/venv/lib/python3.12/site-packages/fastapi/applications.py:1054: in __call__
    await super().__call__(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/applications.py:113: in __call__
    await self.middleware_stack(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/middleware/errors.py:187: in __call__
    raise exc
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/middleware/errors.py:165: in __call__
    await self.app(scope, receive, _send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/middleware/exceptions.py:62: in __call__
    await wrap_app_handling_exceptions(self.app, conn)(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/_exception_handler.py:62: in wrapped_app
    raise exc
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/_exception_handler.py:51: in wrapped_app
    await app(scope, receive, sender)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:715: in __call__
    await self.middleware_stack(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:735: in app
    await route.handle(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:288: in handle
    await self.app(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:76: in app
    await wrap_app_handling_exceptions(app, request)(scope, receive, send)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/_exception_handler.py:62: in wrapped_app
    raise exc
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/_exception_handler.py:51: in wrapped_app
    await app(scope, receive, sender)
Backend/services/catalog/venv/lib/python3.12/site-packages/starlette/routing.py:73: in app
    response = await f(request)
Backend/services/catalog/venv/lib/python3.12/site-packages/fastapi/routing.py:301: in app
    raw_response = await run_endpoint_function(
Backend/services/catalog/venv/lib/python3.12/site-packages/fastapi/routing.py:212: in run_endpoint_function
    return await dependant.call(**values)
Backend/services/catalog/routers/products/store_settings.py:43: in update_bundle_deals
    await db.settings.update_one(
/usr/lib/python3.12/concurrent/futures/thread.py:58: in run
    result = self.fn(*self.args, **self.kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/collection.py:1291: in update_one
    self._update_retryable(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/collection.py:1086: in _update_retryable
    return self._database.client._retryable_write(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1898: in _retryable_write
    return self._retry_with_session(retryable, func, s, bulk, operation, operation_id)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1784: in _retry_with_session
    return self._retry_internal(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/_csot.py:120: in csot_wrapper
    return func(self, *args, **kwargs)
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1830: in _retry_internal
    ).run()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2554: in run
    return self._read() if self._is_read else self._write()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2662: in _write
    self._server = self._get_server()
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:2645: in _get_server
    return self._client._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/mongo_client.py:1649: in _select_server
    server = topology.select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:398: in select_server
    server = self._select_server(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:376: in _select_server
    servers = self.select_servers(
Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:283: in select_servers
    server_descriptions = self._select_servers_loop(
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _

self = <Topology <TopologyDescription id: 6a91715db747ae3ce7b3dda4, topology_type: Unknown, servers: [<ServerDescription ('lo...17: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>>
selector = <function writable_server_selector at 0x7708907416c0>, timeout = 30, operation = <_Op.UPDATE: 'update'>, operation_id = None
address = None

    def _select_servers_loop(
        self,
        selector: Callable[[Selection], Selection],
        timeout: float,
        operation: str,
        operation_id: Optional[int],
        address: Optional[_Address],
    ) -> list[ServerDescription]:
        """select_servers() guts. Hold the lock when calling this."""
        now = time.monotonic()
        end_time = now + timeout
        logged_waiting = False
    
        if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
            _debug_log(
                _SERVER_SELECTION_LOGGER,
                message=_ServerSelectionStatusMessage.STARTED,
                selector=selector,
                operation=operation,
                operationId=operation_id,
                topologyDescription=self.description,
                clientId=self.description._topology_settings._topology_id,
            )
    
        server_descriptions = self._description.apply_selector(
            selector, address, custom_selector=self._settings.server_selector
        )
    
        while not server_descriptions:
            # No suitable servers.
            if timeout == 0 or now > end_time:
                if _SERVER_SELECTION_LOGGER.isEnabledFor(logging.DEBUG):
                    _debug_log(
                        _SERVER_SELECTION_LOGGER,
                        message=_ServerSelectionStatusMessage.FAILED,
                        selector=selector,
                        operation=operation,
                        operationId=operation_id,
                        topologyDescription=self.description,
                        clientId=self.description._topology_settings._topology_id,
                        failure=self._error_message(selector),
                    )
>               raise ServerSelectionTimeoutError(
                    f"{self._error_message(selector)}, Timeout: {timeout}s, Topology Description: {self.description!r}"
                )
E               pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 6a91715db747ae3ce7b3dda4, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]>

Backend/services/catalog/venv/lib/python3.12/site-packages/pymongo/synchronous/topology.py:333: ServerSelectionTimeoutError
============================================================== warnings summary ===============================================================
Backend/services/catalog/venv/lib/python3.12/site-packages/passlib/utils/__init__.py:854
  /home/jjemba/Alpha_pjts/nova_site/novaXchange_client/Backend/services/catalog/venv/lib/python3.12/site-packages/passlib/utils/__init__.py:854: DeprecationWarning: 'crypt' is deprecated and slated for removal in Python 3.13
    from crypt import crypt as _crypt

Backend/services/catalog/venv/lib/python3.12/site-packages/pydantic/_internal/_config.py:291
  /home/jjemba/Alpha_pjts/nova_site/novaXchange_client/Backend/services/catalog/venv/lib/python3.12/site-packages/pydantic/_internal/_config.py:291: PydanticDeprecatedSince20: Support for class-based `config` is deprecated, use ConfigDict instead. Deprecated in Pydantic V2.0 to be removed in V3.0. See Pydantic V2 Migration Guide at https://errors.pydantic.dev/2.9/migration/
    warnings.warn(DEPRECATION_MESSAGE, DeprecationWarning)

Backend/services/catalog/routers/auth/admin.py:151
Backend/services/catalog/tests/test_admin_auth.py::test_request_verification_and_login_flow
Backend/services/catalog/tests/test_admin_auth.py::test_bootstrap_default_admin_from_password
Backend/services/catalog/tests/test_admin_auth.py::test_existing_unverified_default_admin_is_marked_verified
  /home/jjemba/Alpha_pjts/nova_site/novaXchange_client/Backend/services/catalog/routers/auth/admin.py:151: DeprecationWarning: datetime.datetime.utcnow() is deprecated and scheduled for removal in a future version. Use timezone-aware objects to represent datetimes in UTC: datetime.datetime.now(datetime.UTC).
    account["updated_at"] = datetime.utcnow().isoformat()

Backend/services/catalog/tests/test_admin_auth.py::test_request_verification_and_login_flow
Backend/services/catalog/tests/test_admin_auth.py::test_register_verify_and_login_flow
  /home/jjemba/Alpha_pjts/nova_site/novaXchange_client/Backend/services/catalog/routers/auth/admin.py:192: DeprecationWarning: datetime.datetime.utcnow() is deprecated and scheduled for removal in a future version. Use timezone-aware objects to represent datetimes in UTC: datetime.datetime.now(datetime.UTC).
    now = datetime.utcnow().isoformat()

Backend/services/catalog/tests/test_admin_auth.py::test_request_verification_and_login_flow
Backend/services/catalog/tests/test_admin_auth.py::test_register_verify_and_login_flow
  /home/jjemba/Alpha_pjts/nova_site/novaXchange_client/Backend/services/catalog/routers/auth/admin.py:216: DeprecationWarning: datetime.datetime.utcnow() is deprecated and scheduled for removal in a future version. Use timezone-aware objects to represent datetimes in UTC: datetime.datetime.now(datetime.UTC).
    account["verified_at"] = datetime.utcnow().isoformat()

Backend/services/catalog/tests/test_admin_auth.py::test_request_verification_and_login_flow
Backend/services/catalog/tests/test_customer_auth.py::test_admin_token_rejected_by_customer_dependency
Backend/services/catalog/tests/test_customer_auth.py::test_admin_can_list_customers
Backend/services/catalog/tests/test_store_settings.py::test_admin_can_update_and_public_get_reflects_it
  /home/jjemba/Alpha_pjts/nova_site/novaXchange_client/Backend/services/catalog/routers/auth/admin.py:44: DeprecationWarning: datetime.datetime.utcnow() is deprecated and scheduled for removal in a future version. Use timezone-aware objects to represent datetimes in UTC: datetime.datetime.now(datetime.UTC).
    "exp": datetime.utcnow() + timedelta(minutes=settings.jwt_expire_minutes),

Backend/services/catalog/tests/test_admin_auth.py::test_request_verification_and_login_flow
Backend/services/catalog/tests/test_customer_auth.py::test_admin_token_rejected_by_customer_dependency
Backend/services/catalog/tests/test_customer_auth.py::test_admin_can_list_customers
Backend/services/catalog/tests/test_store_settings.py::test_admin_can_update_and_public_get_reflects_it
  /home/jjemba/Alpha_pjts/nova_site/novaXchange_client/Backend/services/catalog/routers/auth/admin.py:45: DeprecationWarning: datetime.datetime.utcnow() is deprecated and scheduled for removal in a future version. Use timezone-aware objects to represent datetimes in UTC: datetime.datetime.now(datetime.UTC).
    "iat": datetime.utcnow(),

Backend/services/catalog/tests/test_admin_auth.py::test_bootstrap_default_admin_from_password
  /home/jjemba/Alpha_pjts/nova_site/novaXchange_client/Backend/services/catalog/routers/auth/admin.py:155: DeprecationWarning: datetime.datetime.utcnow() is deprecated and scheduled for removal in a future version. Use timezone-aware objects to represent datetimes in UTC: datetime.datetime.now(datetime.UTC).
    now = datetime.utcnow().isoformat()

Backend/services/catalog/tests/test_customer_auth.py::test_google_auth_creates_new_user
Backend/services/catalog/tests/test_customer_auth.py::test_password_login_rejected_for_google_only_account
  /home/jjemba/Alpha_pjts/nova_site/novaXchange_client/Backend/services/catalog/routers/auth/customer.py:206: DeprecationWarning: datetime.datetime.utcnow() is deprecated and scheduled for removal in a future version. Use timezone-aware objects to represent datetimes in UTC: datetime.datetime.now(datetime.UTC).
    now = datetime.utcnow()

Backend/services/catalog/tests/test_customer_auth.py::test_customer_token_rejected_by_admin_dependency
Backend/services/catalog/tests/test_orders.py::test_admin_orders_requires_admin_token
  /home/jjemba/Alpha_pjts/nova_site/novaXchange_client/Backend/services/catalog/routers/auth/customer.py:59: DeprecationWarning: datetime.datetime.utcnow() is deprecated and scheduled for removal in a future version. Use timezone-aware objects to represent datetimes in UTC: datetime.datetime.now(datetime.UTC).
    "exp": datetime.utcnow() + timedelta(minutes=settings.customer_jwt_expire_minutes),

Backend/services/catalog/tests/test_customer_auth.py::test_customer_token_rejected_by_admin_dependency
Backend/services/catalog/tests/test_orders.py::test_admin_orders_requires_admin_token
  /home/jjemba/Alpha_pjts/nova_site/novaXchange_client/Backend/services/catalog/routers/auth/customer.py:60: DeprecationWarning: datetime.datetime.utcnow() is deprecated and scheduled for removal in a future version. Use timezone-aware objects to represent datetimes in UTC: datetime.datetime.now(datetime.UTC).
    "iat": datetime.utcnow(),

Backend/services/catalog/tests/test_orders.py: 14 warnings
  /home/jjemba/Alpha_pjts/nova_site/novaXchange_client/Backend/services/catalog/tests/test_orders.py:97: DeprecationWarning: datetime.datetime.utcnow() is deprecated and scheduled for removal in a future version. Use timezone-aware objects to represent datetimes in UTC: datetime.datetime.now(datetime.UTC).
    "created_at": datetime.utcnow(),

Backend/services/catalog/tests/test_orders.py: 14 warnings
  /home/jjemba/Alpha_pjts/nova_site/novaXchange_client/Backend/services/catalog/tests/test_orders.py:98: DeprecationWarning: datetime.datetime.utcnow() is deprecated and scheduled for removal in a future version. Use timezone-aware objects to represent datetimes in UTC: datetime.datetime.now(datetime.UTC).
    "updated_at": datetime.utcnow(),

Backend/services/catalog/tests/test_store_settings.py::test_admin_can_update_and_public_get_reflects_it
  /home/jjemba/Alpha_pjts/nova_site/novaXchange_client/Backend/services/catalog/venv/lib/python3.12/site-packages/jose/jwt.py:311: DeprecationWarning: datetime.datetime.utcnow() is deprecated and scheduled for removal in a future version. Use timezone-aware objects to represent datetimes in UTC: datetime.datetime.now(datetime.UTC).
    now = timegm(datetime.utcnow().utctimetuple())

-- Docs: https://docs.pytest.org/en/stable/how-to/capture-warnings.html
=========================================================== short test summary info ===========================================================
FAILED Backend/services/catalog/tests/test_customer_auth.py::test_register_creates_account_and_returns_token - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
FAILED Backend/services/catalog/tests/test_customer_auth.py::test_register_duplicate_email_returns_409 - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
FAILED Backend/services/catalog/tests/test_customer_auth.py::test_login_wrong_password_returns_401 - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
FAILED Backend/services/catalog/tests/test_customer_auth.py::test_login_correct_password_returns_token - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
FAILED Backend/services/catalog/tests/test_customer_auth.py::test_me_returns_profile - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
FAILED Backend/services/catalog/tests/test_customer_auth.py::test_update_me_updates_profile - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
FAILED Backend/services/catalog/tests/test_customer_auth.py::test_google_auth_creates_new_user - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
FAILED Backend/services/catalog/tests/test_customer_auth.py::test_google_auth_links_existing_password_account - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
FAILED Backend/services/catalog/tests/test_customer_auth.py::test_password_login_rejected_for_google_only_account - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
FAILED Backend/services/catalog/tests/test_customer_auth.py::test_admin_can_list_customers - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
FAILED Backend/services/catalog/tests/test_orders.py::test_create_order_decrements_stock - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
FAILED Backend/services/catalog/tests/test_orders.py::test_create_order_guest_has_no_user_id - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
FAILED Backend/services/catalog/tests/test_orders.py::test_create_order_links_logged_in_customer - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
FAILED Backend/services/catalog/tests/test_orders.py::test_insufficient_stock_returns_422_with_no_mutation - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
FAILED Backend/services/catalog/tests/test_orders.py::test_inactive_product_rejected - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
FAILED Backend/services/catalog/tests/test_orders.py::test_stock_race_rolls_back_earlier_decrements - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
FAILED Backend/services/catalog/tests/test_orders.py::test_guest_lookup_wrong_contact_returns_404 - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
FAILED Backend/services/catalog/tests/test_orders.py::test_guest_lookup_correct_contact_returns_order - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
FAILED Backend/services/catalog/tests/test_orders.py::test_my_orders_lists_own_orders - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
FAILED Backend/services/catalog/tests/test_orders.py::test_admin_can_list_and_view_order - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
FAILED Backend/services/catalog/tests/test_orders.py::test_valid_transition_pending_to_confirmed - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
FAILED Backend/services/catalog/tests/test_orders.py::test_invalid_transition_pending_to_shipped_rejected - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
FAILED Backend/services/catalog/tests/test_orders.py::test_invalid_transition_from_terminal_delivered_rejected - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
FAILED Backend/services/catalog/tests/test_orders.py::test_cancellation_restores_stock_exactly_once - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
FAILED Backend/services/catalog/tests/test_store_settings.py::test_get_bundle_deals_defaults_to_disabled_when_unset - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
FAILED Backend/services/catalog/tests/test_store_settings.py::test_admin_can_update_and_public_get_reflects_it - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
ERROR Backend/services/catalog/tests/test_customer_auth.py::test_register_creates_account_and_returns_token - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
ERROR Backend/services/catalog/tests/test_customer_auth.py::test_register_duplicate_email_returns_409 - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
ERROR Backend/services/catalog/tests/test_customer_auth.py::test_login_wrong_password_returns_401 - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
ERROR Backend/services/catalog/tests/test_customer_auth.py::test_login_correct_password_returns_token - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
ERROR Backend/services/catalog/tests/test_customer_auth.py::test_me_requires_token - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
ERROR Backend/services/catalog/tests/test_customer_auth.py::test_me_returns_profile - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
ERROR Backend/services/catalog/tests/test_customer_auth.py::test_update_me_updates_profile - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
ERROR Backend/services/catalog/tests/test_customer_auth.py::test_google_auth_creates_new_user - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
ERROR Backend/services/catalog/tests/test_customer_auth.py::test_google_auth_links_existing_password_account - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
ERROR Backend/services/catalog/tests/test_customer_auth.py::test_password_login_rejected_for_google_only_account - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
ERROR Backend/services/catalog/tests/test_customer_auth.py::test_admin_token_rejected_by_customer_dependency - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
ERROR Backend/services/catalog/tests/test_customer_auth.py::test_admin_can_list_customers - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
ERROR Backend/services/catalog/tests/test_customer_auth.py::test_list_customers_requires_admin_token - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
ERROR Backend/services/catalog/tests/test_customer_auth.py::test_customer_token_rejected_by_admin_dependency - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
ERROR Backend/services/catalog/tests/test_orders.py::test_create_order_decrements_stock - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
ERROR Backend/services/catalog/tests/test_orders.py::test_create_order_guest_has_no_user_id - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
ERROR Backend/services/catalog/tests/test_orders.py::test_create_order_links_logged_in_customer - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
ERROR Backend/services/catalog/tests/test_orders.py::test_insufficient_stock_returns_422_with_no_mutation - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
ERROR Backend/services/catalog/tests/test_orders.py::test_inactive_product_rejected - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
ERROR Backend/services/catalog/tests/test_orders.py::test_invalid_product_id_rejected - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
ERROR Backend/services/catalog/tests/test_orders.py::test_stock_race_rolls_back_earlier_decrements - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
ERROR Backend/services/catalog/tests/test_orders.py::test_guest_lookup_wrong_contact_returns_404 - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
ERROR Backend/services/catalog/tests/test_orders.py::test_guest_lookup_correct_contact_returns_order - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
ERROR Backend/services/catalog/tests/test_orders.py::test_my_orders_requires_customer_token - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
ERROR Backend/services/catalog/tests/test_orders.py::test_my_orders_lists_own_orders - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
ERROR Backend/services/catalog/tests/test_orders.py::test_admin_orders_requires_admin_token - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
ERROR Backend/services/catalog/tests/test_orders.py::test_admin_can_list_and_view_order - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
ERROR Backend/services/catalog/tests/test_orders.py::test_valid_transition_pending_to_confirmed - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
ERROR Backend/services/catalog/tests/test_orders.py::test_invalid_transition_pending_to_shipped_rejected - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
ERROR Backend/services/catalog/tests/test_orders.py::test_invalid_transition_from_terminal_delivered_rejected - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
ERROR Backend/services/catalog/tests/test_orders.py::test_cancellation_restores_stock_exactly_once - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
ERROR Backend/services/catalog/tests/test_store_settings.py::test_get_bundle_deals_defaults_to_disabled_when_unset - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
ERROR Backend/services/catalog/tests/test_store_settings.py::test_admin_can_update_and_public_get_reflects_it - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
ERROR Backend/services/catalog/tests/test_store_settings.py::test_update_bundle_deals_requires_admin_token - pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 111] Connection refused (configured timeouts: socketTimeoutMS: 20000.0...
===================================== 26 failed, 12 passed, 54 warnings, 34 errors in 1818.66s (0:30:18) ======================================