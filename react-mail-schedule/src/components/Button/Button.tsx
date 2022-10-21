import classNames from 'classnames';

type Props = {
  variant?: 'default' | 'primary' | 'light' | 'dark';
  children: React.ReactNode;
};
export function Button({ variant, children }: Props) {
  let bgColor = 'text-black';
  if (variant === 'primary')
    bgColor =
      'bg-primary hover:bg-primaryLight hover:text-gray-700 active:bg-primaryDark active:text-white transition-all text-white';
  if (variant === 'dark') bgColor = 'bg-primaryDark text-white hover:bg-primary hover:text-white active:bg-primaryLight active:text-gray-700';
  if (variant === 'light') bgColor = 'bg-primaryLight text-gray-700 hover:bg-primary hover:text-white active:bg-primaryDark active:text-white';
  return (
    <button className={classNames('py-2 px-4 rounded-md font-bold', bgColor)}>
      {children}
    </button>
  );
}
