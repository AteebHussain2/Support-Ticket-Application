import RedirectUserAnimation from "@/components/RedirectUserAnimation";
import { redirectByRole } from "@/actions/redirectByRole";

const RedirectUser = async () => {
    await redirectByRole();

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-4">
            <RedirectUserAnimation />
        </div>
    );
};

export default RedirectUser;