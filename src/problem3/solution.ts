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
    private url: string;

    constructor(url: string) {
        this.url = url;
    }

    async getPrices(): Promise<any> {
        try {
            const response = await fetch(this.url);
            const prices = await response.json();
            return prices;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
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
            console.error(error);
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
            return balancePriority > -99 && balance.amount > 0; // collapsed the two conditions into one line
        }).sort((lhs: WalletBalance, rhs: WalletBalance) => {
            const leftPriority = getPriority(lhs.blockchain);
            const rightPriority = getPriority(rhs.blockchain);
            return rightPriority - leftPriority; // collapsed the if else block
        }).map((balance: WalletBalance) => {
            return {
                ...balance,
                formatted: balance.amount.toFixed()
            }
        })
    }, [balances]);

    const rows = useMemo(() => {
            sortedBalances.map((balance: FormattedWalletBalance) => {
            const usdValue = prices[balance.currency] * balance.amount;
            return (
                <WalletRow 
                    className= { classes.row }
                    key = { balance.blockchain } // blockchain is used as key, assuming it is unique given the context
                    amount = { balance.amount }
                    usdValue = { usdValue }
                    formattedAmount = { balance.formatted }
                />
            )
        }, [sortedBalances, prices])
    })

    return (
        <div { ...rest } >
            { rows }
        </div>
    )
}