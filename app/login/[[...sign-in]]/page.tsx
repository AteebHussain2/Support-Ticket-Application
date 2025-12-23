import { SignIn } from '@clerk/nextjs'

export default function Page() {
    return (
        <main className="min-h-screen w-full mx-auto my-2 flex items-center justify-center">
            <SignIn />
        </main>
    )
}