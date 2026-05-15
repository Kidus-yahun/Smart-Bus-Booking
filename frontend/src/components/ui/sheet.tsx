'use client';

import * as React from 'react';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';

import { cn } from './utils';

type SheetProps = React.ComponentPropsWithoutRef<typeof SheetPrimitive.Root>;
type SheetTriggerProps = React.ComponentPropsWithoutRef<typeof SheetPrimitive.Trigger>;
type SheetCloseProps = React.ComponentPropsWithoutRef<typeof SheetPrimitive.Close>;
type SheetPortalProps = React.ComponentPropsWithoutRef<typeof SheetPrimitive.Portal>;
type SheetOverlayProps = React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>;
type SheetContentProps = React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> & {
  side?: 'top' | 'right' | 'bottom' | 'left';
};
type SheetTitleProps = React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>;
type SheetDescriptionProps = React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>;
type DivProps = React.ComponentPropsWithoutRef<'div'>;

const Sheet = (props: SheetProps) => (
  <SheetPrimitive.Root data-slot="sheet" {...props} />
);

const SheetTrigger = (props: SheetTriggerProps) => (
  <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
);

const SheetClose = (props: SheetCloseProps) => (
  <SheetPrimitive.Close data-slot="sheet-close" {...props} />
);

const SheetPortal = (props: SheetPortalProps) => (
  <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
);

const SheetOverlay = React.forwardRef<HTMLDivElement, SheetOverlayProps>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    ref={ref}
    data-slot="sheet-overlay"
    className={cn(
      'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-40 bg-black/50',
      className
    )}
    {...props}
  />
));
SheetOverlay.displayName = 'SheetOverlay';

const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(({ className, children, side = 'right', ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      data-slot="sheet-content"
      className={cn(
        'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-40 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
        side === 'right' &&
          'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
        side === 'left' &&
          'data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
        side === 'top' &&
          'data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b',
        side === 'bottom' &&
          'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-[85vh] w-full rounded-t-3xl border-t',
        className
      )}
      {...props}
    >
      {children}
    </SheetPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = 'SheetContent';

const SheetHeader = React.forwardRef<HTMLDivElement, DivProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="sheet-header"
    className={cn('flex flex-col gap-1.5 p-4', className)}
    {...props}
  />
));
SheetHeader.displayName = 'SheetHeader';

const SheetFooter = React.forwardRef<HTMLDivElement, DivProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="sheet-footer"
    className={cn('mt-auto flex flex-col gap-2 p-4', className)}
    {...props}
  />
));
SheetFooter.displayName = 'SheetFooter';

const SheetTitle = React.forwardRef<HTMLHeadingElement, SheetTitleProps>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    data-slot="sheet-title"
    className={cn('text-foreground font-semibold', className)}
    {...props}
  />
));
SheetTitle.displayName = 'SheetTitle';

const SheetDescription = React.forwardRef<HTMLParagraphElement, SheetDescriptionProps>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    data-slot="sheet-description"
    className={cn('text-muted-foreground text-sm', className)}
    {...props}
  />
));
SheetDescription.displayName = 'SheetDescription';

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
};
