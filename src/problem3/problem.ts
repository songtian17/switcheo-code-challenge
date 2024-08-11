interface WalletBalance {
    currency: string;
    amount: number;
}
interface FormattedWalletBalance {
    currency: string;
    amount: number;
    formatted: string;
}

class Datasource {
    // TODO: Implement datasource class
}

interface Props extends BoxProps {

}
const WalletPage: React.FC<Props> = (props: Props) => {
    const { children, ...rest } = props;
    const balances = useWalletBalances();
    const [prices, setPrices] = useState({});

    useEffect(() => {
        const datasource = new Datasource("https://interview.switcheo.com/prices.json");
        datasource.getPrices().then(prices => {
            setPrices(prices);
        }).catch(error => {
            console.err(error);
        });
    }, []);

    const getPriority = (blockchain: any): number => {
        switch (blockchain) {
            case 'Osmosis':
                return 100
            case 'Ethereum':
                return 50
            case 'Arbitrum':
                return 30
            case 'Zilliqa':
                return 20
            case 'Neo':
                return 20
            default:
                return -99
        }
    }

    const sortedBalances = useMemo(() => {
        return balances.filter((balance: WalletBalance) => {
            const balancePriority = getPriority(balance.blockchain);
            if (lhsPriority > -99) { // "balancePriority" should be used instead of "lhsPriority"
                if (balance.amount <= 0) { // this code filters out balances with amount > 0, which may not be the intended behavior 
                    return true;
                }
            }
            return false
        }).sort((lhs: WalletBalance, rhs: WalletBalance) => {
            const leftPriority = getPriority(lhs.blockchain);
            const rightPriority = getPriority(rhs.blockchain);
            if (leftPriority > rightPriority) {
                return -1;
            } else if (rightPriority > leftPriority) {
                return 1;
            } // does not return anything in case of comparing "zilliqa" and "neo"
        });
    }, [balances, prices]); // "prices" should not be a dependency of this function

    const formattedBalances = sortedBalances.map((balance: WalletBalance) => { // function can be moved into existing useMemo hook
        return {
            ...balance,
            formatted: balance.amount.toFixed()
        }
    })

    const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => { // can be memoized using useMemo hook
        const usdValue = prices[balance.currency] * balance.amount;
        return (
            <WalletRow 
                className= { classes.row }
                key = { index } // index should not be used as key if possible
                amount = { balance.amount }
                usdValue = { usdValue }
                formattedAmount = { balance.formatted }
            />
        )
    })

    return (
        <div { ...rest } >
            { rows }
        </div>
    )
}