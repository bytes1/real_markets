import { useAccount, useDisconnect } from "wagmi";
import { Button } from "../common/Button";
import { DefaultLogin } from "../ConnectButtons/DefaultLogin";

export const Connect = () => {
  const { isConnected, isConnecting: isAccountConnecting } = useAccount();
  const { disconnect, isPending: isDisconnecting } = useDisconnect();

  return (
    <div className="mt-4 gap-2">
      {isAccountConnecting ? (
        <Button className="w-full max-w-3xs mx-auto block" disabled>
          Connecting...
        </Button>
      ) : isConnected ? (
        <Button
          className="w-full max-w-3xs mx-auto block"
          onClick={() => disconnect()}
          disabled={isDisconnecting}
          variant="danger"
        >
          {isDisconnecting ? "Logging out..." : "Logout"}
        </Button>
      ) : (
        <div className="w-full">
          <DefaultLogin />
        </div>
      )}
    </div>
  );
};
