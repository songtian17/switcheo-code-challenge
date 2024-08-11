# Transaction Broadcaster Service

Firstly, the service should have a message queue that manages the incoming broadcast requests coming from other services to the internal API. The message queue should also be able to sort the requests based on certain factors, such as the timestamps or gas fees for the transaction.

To keep track of all the broadcasted transactions, a logging service is needed to record each successful and failed transactions. Failed transactions should also go into a message queue, which is monitored so that failed transactions can be retried automatically. The failed transactions queue should also manage the number of retries for each transaction and set a maximum retry limit. The queue should also manage the delay before retrying the same transaction, which should increase as the number of attempts increase, so that it reduces the strain on the network and increases the chances of a successful transaction.

To determine if a broadcasted transaction is a success or failure, the RPC request should have a timeout of 30 seconds. If a request exceeds the timeout limit, the transaction should go into the previously mentioned retry queue.

The logging service which tracks all the broadcasted transactions should store its data in persistant storage such as a database. A web page is needed to display the logged transactions and their status. The web page should subscribe to new entries in the database through a pub-sub service to receive details on broadcasted transactions in real time.

The web page should have an authentication service to authorize an admin to retry a failed broadcast by sending the transaction details from the database to the retry queue.
