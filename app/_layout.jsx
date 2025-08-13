import { Slot, Redirect, usePathname } from 'expo-router';

export default function SignInLayout() {
  const session = true;
  const pathname = usePathname();

  if (!session && pathname !== '/SignIn') {
    return <Redirect href="/SignIn" />;
  }

  return <Slot />;
}
