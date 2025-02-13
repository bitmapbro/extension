import Jazzicon, { jsNumberForAddress } from "react-jazzicon";

export default ({ address }: { address: string }) => {
  return (
    <div>
      <Jazzicon diameter={16} seed={jsNumberForAddress(address)} />
      <p onClick={() => navigator.clipboard.writeText(address)}>
        {address.slice(0, 5) + "..." + address.slice(-4)}
      </p>
    </div>
  );
};
