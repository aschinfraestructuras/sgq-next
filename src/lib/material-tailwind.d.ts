import "@material-tailwind/react";

declare module "@material-tailwind/react" {
  export interface ThemeProvider {
    children: React.ReactNode;
  }
  
  export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    color?: "blue" | "red" | "green" | "amber" | "blue-gray";
    variant?: "text" | "filled" | "gradient" | "outlined";
    size?: "sm" | "md" | "lg";
    fullWidth?: boolean;
    ripple?: boolean;
  }

  export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
    variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "lead" | "paragraph" | "small";
    color?: "inherit" | "current" | "black" | "white" | "blue-gray" | "gray" | "brown" | "deep-orange" | "orange" | "amber" | "yellow" | "lime" | "light-green" | "green" | "teal" | "cyan" | "light-blue" | "blue" | "indigo" | "deep-purple" | "purple" | "pink" | "red";
    textGradient?: boolean;
    className?: string;
  }

  export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "filled" | "gradient";
    color?: string;
    shadow?: boolean | "sm" | "md" | "lg" | "xl";
    className?: string;
  }

  export interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {
    open: boolean;
    handler: () => void;
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
    dismiss?: object;
    animate?: object;
    className?: string;
  }

  export interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
  }

  export interface DialogBodyProps extends React.HTMLAttributes<HTMLDivElement> {
    divider?: boolean;
    className?: string;
  }

  export interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
  }

  export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    variant?: "standard" | "outlined" | "static";
    size?: "md" | "lg";
    color?: string;
    label?: string;
    error?: boolean;
    success?: boolean;
    className?: string;
  }

  export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    variant?: "standard" | "outlined" | "static";
    size?: "md" | "lg";
    color?: string;
    label?: string;
    error?: boolean;
    success?: boolean;
    className?: string;
  }

  export interface IconButtonProps extends ButtonProps {
    ripple?: boolean;
  }
} 