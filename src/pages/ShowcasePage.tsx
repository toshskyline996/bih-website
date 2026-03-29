import { useState } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from '@/components/ui/command';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuSeparator, ContextMenuShortcut, ContextMenuTrigger } from '@/components/ui/context-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from '@/components/ui/menubar';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from '@/components/ui/radix-tabs';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ChevronsUpDown, CalendarDays, Settings, User, CreditCard, LogOut } from 'lucide-react';

/** 统一的组件展示卡片容器 */
function ShowcaseSection({ title, description, docsHref, children }: {
  title: string;
  description: string;
  docsHref: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-8 py-8 border-b border-slate-200 last:border-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h2>
          <p className="text-slate-500 text-base max-w-xl">{description}</p>
        </div>
        <a
          href={docsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 transition-colors"
        >
          View docs
        </a>
      </div>
      <div className="flex items-start justify-center flex-wrap gap-6 p-8 rounded-lg bg-slate-50 border border-slate-200">
        {children}
      </div>
    </section>
  );
}

export default function ShowcasePage() {
  const [sliderValue, setSliderValue] = useState([50]);
  const [progressValue] = useState(68);
  const [switchChecked, setSwitchChecked] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [collapseOpen, setCollapseOpen] = useState(false);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-white">
        {/* ── 页面标题 ── */}
        <div className="border-b border-slate-200 bg-slate-50 px-8 py-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">UI Component Showcase</h1>
          <p className="mt-3 text-lg text-slate-500">27 shadcn/ui components — implemented with Radix UI + Tailwind CSS</p>
        </div>

        <div className="mx-auto max-w-4xl px-8 py-12 flex flex-col gap-0">

          {/* 1. Accordion */}
          <ShowcaseSection
            title="Accordion"
            description="A vertically stacked set of interactive headings that each reveal a section of content."
            docsHref="https://ui.shadcn.com/docs/components/accordion"
          >
            <Accordion type="single" collapsible className="w-full max-w-md">
              <AccordionItem value="item-1">
                <AccordionTrigger>Is it accessible?</AccordionTrigger>
                <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Is it styled?</AccordionTrigger>
                <AccordionContent>Yes. It comes with default styles that match the other components.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Is it animated?</AccordionTrigger>
                <AccordionContent>Yes. It's animated by default, but you can disable it if you prefer.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </ShowcaseSection>

          {/* 2. Alert Dialog */}
          <ShowcaseSection
            title="Alert Dialog"
            description="A modal dialog that interrupts the user with important content and expects a response."
            docsHref="https://ui.shadcn.com/docs/components/alert-dialog"
          >
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">Show Dialog</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </ShowcaseSection>

          {/* 3. Aspect Ratio */}
          <ShowcaseSection
            title="Aspect Ratio"
            description="Displays content within a desired ratio."
            docsHref="https://ui.shadcn.com/docs/components/aspect-ratio"
          >
            <div className="w-64">
              <AspectRatio ratio={16 / 9} className="bg-slate-800 rounded-md overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=640&auto=format"
                  alt="Landscape"
                  className="w-full h-full object-cover"
                />
              </AspectRatio>
            </div>
          </ShowcaseSection>

          {/* 4. Avatar */}
          <ShowcaseSection
            title="Avatar"
            description="An image element with a fallback for representing the user."
            docsHref="https://ui.shadcn.com/docs/components/avatar"
          >
            <div className="flex gap-3 items-center">
              <Avatar className="h-14 w-14">
                <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage src="https://invalid-url.png" alt="fallback" />
                <AvatarFallback>BIH</AvatarFallback>
              </Avatar>
            </div>
          </ShowcaseSection>

          {/* 5. Button */}
          <ShowcaseSection
            title="Button"
            description="Displays a button or a component that looks like a button."
            docsHref="https://ui.shadcn.com/docs/components/button"
          >
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" size="md">Primary</Button>
              <Button variant="secondary" size="md">Secondary</Button>
              <Button variant="outline" size="md">Outline</Button>
              <Button variant="ghost" size="md">Ghost</Button>
              <Button variant="danger" size="md">Danger</Button>
            </div>
          </ShowcaseSection>

          {/* 6. Checkbox */}
          <ShowcaseSection
            title="Checkbox"
            description="A control that allows the user to toggle between checked and not checked."
            docsHref="https://ui.shadcn.com/docs/components/checkbox"
          >
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={checkboxChecked}
                onCheckedChange={(val) => setCheckboxChecked(!!val)}
              />
              <Label htmlFor="terms">Accept terms and conditions</Label>
            </div>
          </ShowcaseSection>

          {/* 7. Collapsible */}
          <ShowcaseSection
            title="Collapsible"
            description="An interactive component which expands/collapses a panel."
            docsHref="https://ui.shadcn.com/docs/components/collapsible"
          >
            <Collapsible open={collapseOpen} onOpenChange={setCollapseOpen} className="w-full max-w-sm space-y-2">
              <div className="flex items-center justify-between px-4">
                <h4 className="text-sm font-semibold">@peduarte starred 3 repositories</h4>
                <CollapsibleTrigger asChild>
                  <button className="rounded-sm p-1 hover:bg-slate-100 transition-colors">
                    <ChevronsUpDown className="h-4 w-4 text-slate-500" />
                  </button>
                </CollapsibleTrigger>
              </div>
              <div className="rounded-md border border-slate-200 px-4 py-3 font-mono text-sm">@radix-ui/primitives</div>
              <CollapsibleContent className="space-y-2">
                <div className="rounded-md border border-slate-200 px-4 py-3 font-mono text-sm">@radix-ui/colors</div>
                <div className="rounded-md border border-slate-200 px-4 py-3 font-mono text-sm">@stitches/react</div>
              </CollapsibleContent>
            </Collapsible>
          </ShowcaseSection>

          {/* 8. Command */}
          <ShowcaseSection
            title="Command"
            description="Fast, composable, unstyled command menu for React."
            docsHref="https://ui.shadcn.com/docs/components/command"
          >
            <Command className="rounded-lg border border-slate-200 shadow-md w-72">
              <CommandInput placeholder="Type a command or search..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                  <CommandItem>Calendar</CommandItem>
                  <CommandItem>Search Emoji</CommandItem>
                  <CommandItem>Calculator</CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Settings">
                  <CommandItem>Profile <CommandShortcut>⌘P</CommandShortcut></CommandItem>
                  <CommandItem>Billing <CommandShortcut>⌘B</CommandShortcut></CommandItem>
                  <CommandItem>Settings <CommandShortcut>⌘S</CommandShortcut></CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </ShowcaseSection>

          {/* 9. Context Menu */}
          <ShowcaseSection
            title="Context Menu"
            description="Displays a menu to the user — triggered by right-clicking an area."
            docsHref="https://ui.shadcn.com/docs/components/context-menu"
          >
            <ContextMenu>
              <ContextMenuTrigger className="flex h-24 w-64 items-center justify-center rounded-md border border-dashed border-slate-300 text-sm text-slate-500">
                Right click here
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem>Back <ContextMenuShortcut>⌘[</ContextMenuShortcut></ContextMenuItem>
                <ContextMenuItem>Forward <ContextMenuShortcut>⌘]</ContextMenuShortcut></ContextMenuItem>
                <ContextMenuItem>Reload <ContextMenuShortcut>⌘R</ContextMenuShortcut></ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuLabel>People</ContextMenuLabel>
                <ContextMenuItem>Pedro Duarte</ContextMenuItem>
                <ContextMenuItem>Colm Tuite</ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </ShowcaseSection>

          {/* 10. Dialog */}
          <ShowcaseSection
            title="Dialog"
            description="A modal dialog that interrupts the user with important content and expects a response."
            docsHref="https://ui.shadcn.com/docs/components/dialog"
          >
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">Edit Profile</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit profile</DialogTitle>
                  <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Name</Label>
                    <Input id="name" defaultValue="Pedro Duarte" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">Username</Label>
                    <Input id="username" defaultValue="@peduarte" className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="secondary" size="sm">Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </ShowcaseSection>

          {/* 11. Dropdown Menu */}
          <ShowcaseSection
            title="Dropdown Menu"
            description="Displays a menu to the user — such as a set of actions or functions — triggered by a button."
            docsHref="https://ui.shadcn.com/docs/components/dropdown-menu"
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">Open Menu</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem><User className="mr-2 h-4 w-4" /><span>Profile</span><DropdownMenuShortcut>⌘P</DropdownMenuShortcut></DropdownMenuItem>
                  <DropdownMenuItem><CreditCard className="mr-2 h-4 w-4" /><span>Billing</span><DropdownMenuShortcut>⌘B</DropdownMenuShortcut></DropdownMenuItem>
                  <DropdownMenuItem><Settings className="mr-2 h-4 w-4" /><span>Settings</span><DropdownMenuShortcut>⌘S</DropdownMenuShortcut></DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem><LogOut className="mr-2 h-4 w-4" /><span>Log out</span><DropdownMenuShortcut>⌘Q</DropdownMenuShortcut></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </ShowcaseSection>

          {/* 12. Hover Card */}
          <ShowcaseSection
            title="Hover Card"
            description="For sighted users to preview content available behind a link."
            docsHref="https://ui.shadcn.com/docs/components/hover-card"
          >
            <HoverCard>
              <HoverCardTrigger asChild>
                <a href="#" className="text-slate-900 font-medium underline underline-offset-4 hover:text-slate-600 transition-colors">@nextjs</a>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="flex justify-between space-x-4">
                  <Avatar>
                    <AvatarImage src="https://github.com/vercel.png" />
                    <AvatarFallback>VC</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">@nextjs</h4>
                    <p className="text-sm text-slate-500">The React Framework — created and maintained by @vercel.</p>
                    <div className="flex items-center pt-2">
                      <CalendarDays className="mr-2 h-4 w-4 text-slate-400" />
                      <span className="text-xs text-slate-500">Joined December 2021</span>
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </ShowcaseSection>

          {/* 13. Input */}
          <ShowcaseSection
            title="Input"
            description="Displays a form input field or a component that looks like an input field."
            docsHref="https://ui.shadcn.com/docs/components/input"
          >
            <div className="flex flex-col gap-3 w-64">
              <Input type="email" placeholder="Email" />
              <Input type="password" placeholder="Password" />
              <Input type="text" disabled placeholder="Disabled input" />
            </div>
          </ShowcaseSection>

          {/* 14. Label */}
          <ShowcaseSection
            title="Label"
            description="Renders an accessible label associated with controls."
            docsHref="https://ui.shadcn.com/docs/components/label"
          >
            <div className="flex flex-col gap-2 w-48">
              <Label htmlFor="label-demo">Your name</Label>
              <Input id="label-demo" placeholder="John Doe" />
            </div>
          </ShowcaseSection>

          {/* 15. Menubar */}
          <ShowcaseSection
            title="Menubar"
            description="A visually persistent menu common in desktop applications."
            docsHref="https://ui.shadcn.com/docs/components/menubar"
          >
            <Menubar>
              <MenubarMenu>
                <MenubarTrigger>File</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>New Tab <MenubarShortcut>⌘T</MenubarShortcut></MenubarItem>
                  <MenubarItem>New Window <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>Print <MenubarShortcut>⌘P</MenubarShortcut></MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger>Edit</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>Undo <MenubarShortcut>⌘Z</MenubarShortcut></MenubarItem>
                  <MenubarItem>Redo <MenubarShortcut>⌘⇧Z</MenubarShortcut></MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger>View</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>Zoom In</MenubarItem>
                  <MenubarItem>Zoom Out</MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </ShowcaseSection>

          {/* 16. Navigation Menu */}
          <ShowcaseSection
            title="Navigation Menu"
            description="A collection of links for navigating websites."
            docsHref="https://ui.shadcn.com/docs/components/navigation-menu"
          >
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a href="#" className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-slate-500 to-slate-900 p-6 no-underline outline-none focus:shadow-md">
                            <div className="mb-2 mt-4 text-lg font-medium text-white">shadcn/ui</div>
                            <p className="text-sm leading-tight text-slate-200">Beautifully designed components built with Radix UI and Tailwind CSS.</p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li><NavigationMenuLink asChild><a href="#" className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100"><div className="text-sm font-medium">Introduction</div><p className="text-sm text-slate-500">Re-usable components built using Radix UI and Tailwind CSS.</p></a></NavigationMenuLink></li>
                      <li><NavigationMenuLink asChild><a href="#" className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100"><div className="text-sm font-medium">Installation</div><p className="text-sm text-slate-500">How to install dependencies and structure your app.</p></a></NavigationMenuLink></li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink href="#" className="inline-flex h-10 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-100 focus:outline-none">
                    Documentation
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </ShowcaseSection>

          {/* 17. Popover */}
          <ShowcaseSection
            title="Popover"
            description="Displays rich content in a portal, triggered by a button."
            docsHref="https://ui.shadcn.com/docs/components/popover"
          >
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">Open Popover</Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Dimensions</h4>
                    <p className="text-sm text-slate-500">Set the dimensions for the layer.</p>
                  </div>
                  <div className="grid gap-2">
                    {['Width', 'Max. width', 'Height', 'Max. height'].map((label) => (
                      <div key={label} className="grid grid-cols-3 items-center gap-4">
                        <Label>{label}</Label>
                        <Input className="col-span-2 h-8" defaultValue={label === 'Width' ? '100%' : label === 'Max. width' ? '300px' : label === 'Height' ? '25px' : 'none'} />
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </ShowcaseSection>

          {/* 18. Progress */}
          <ShowcaseSection
            title="Progress"
            description="Displays an indicator showing the completion progress of a task, typically displayed as a progress bar."
            docsHref="https://ui.shadcn.com/docs/components/progress"
          >
            <div className="w-80 space-y-2">
              <Progress value={progressValue} className="h-4" />
              <p className="text-sm text-slate-500 text-center">{progressValue}% complete</p>
            </div>
          </ShowcaseSection>

          {/* 19. Radio Group */}
          <ShowcaseSection
            title="Radio Group"
            description="A set of checkable buttons — known as radio buttons — where no more than one can be checked at a time."
            docsHref="https://ui.shadcn.com/docs/components/radio-group"
          >
            <RadioGroup defaultValue="comfortable">
              {['Default', 'Comfortable', 'Compact'].map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.toLowerCase()} id={`r-${option}`} />
                  <Label htmlFor={`r-${option}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </ShowcaseSection>

          {/* 20. Scroll Area */}
          <ShowcaseSection
            title="Scroll Area"
            description="Augments native scroll functionality for custom, cross-browser styling."
            docsHref="https://ui.shadcn.com/docs/components/scroll-area"
          >
            <ScrollArea className="h-48 w-60 rounded-md border border-slate-200">
              <div className="p-4">
                <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
                {Array.from({ length: 20 }, (_, i) => `Tag ${i + 1}`).map((tag) => (
                  <div key={tag} className="text-sm py-1 border-b border-slate-100 last:border-0">{tag}</div>
                ))}
              </div>
            </ScrollArea>
          </ShowcaseSection>

          {/* 21. Select */}
          <ShowcaseSection
            title="Select"
            description="Displays a list of options for the user to pick from—triggered by a button."
            docsHref="https://ui.shadcn.com/docs/components/select"
          >
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Fruits</SelectLabel>
                  <SelectItem value="apple">Apple</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>
                  <SelectItem value="blueberry">Blueberry</SelectItem>
                  <SelectItem value="grapes">Grapes</SelectItem>
                  <SelectItem value="pineapple">Pineapple</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </ShowcaseSection>

          {/* 22. Separator */}
          <ShowcaseSection
            title="Separator"
            description="Visually or semantically separates content."
            docsHref="https://ui.shadcn.com/docs/components/separator"
          >
            <div className="w-72 space-y-4">
              <div>
                <h4 className="text-sm font-medium">Radix Primitives</h4>
                <p className="text-sm text-slate-500">An open-source UI component library.</p>
              </div>
              <Separator />
              <div className="flex h-5 items-center space-x-4 text-sm">
                <span>Blog</span>
                <Separator orientation="vertical" />
                <span>Docs</span>
                <Separator orientation="vertical" />
                <span>Source</span>
              </div>
            </div>
          </ShowcaseSection>

          {/* 23. Slider */}
          <ShowcaseSection
            title="Slider"
            description="An input where the user selects a value from within a given range."
            docsHref="https://ui.shadcn.com/docs/components/slider"
          >
            <div className="w-80 space-y-4">
              <Slider value={sliderValue} onValueChange={setSliderValue} max={100} step={1} />
              <p className="text-sm text-slate-500 text-center">Value: {sliderValue[0]}</p>
            </div>
          </ShowcaseSection>

          {/* 24. Switch */}
          <ShowcaseSection
            title="Switch"
            description="A control that allows the user to toggle between checked and not checked."
            docsHref="https://ui.shadcn.com/docs/components/switch"
          >
            <div className="flex items-center space-x-2">
              <Switch id="airplane-mode" checked={switchChecked} onCheckedChange={setSwitchChecked} />
              <Label htmlFor="airplane-mode">Airplane mode {switchChecked ? 'ON' : 'OFF'}</Label>
            </div>
          </ShowcaseSection>

          {/* 25. Tabs */}
          <ShowcaseSection
            title="Tabs"
            description="A set of layered sections of content—known as tab panels—that are displayed one at a time."
            docsHref="https://ui.shadcn.com/docs/components/tabs"
          >
            <TabsRoot defaultValue="account" className="w-80">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
              </TabsList>
              <TabsContent value="account">
                <div className="rounded-md border border-slate-200 p-4 space-y-3">
                  <p className="text-sm text-slate-500">Make changes to your account here.</p>
                  <div className="space-y-1">
                    <Label htmlFor="tab-name">Name</Label>
                    <Input id="tab-name" defaultValue="Pietro Schirano" />
                  </div>
                  <Button variant="secondary" size="sm">Save changes</Button>
                </div>
              </TabsContent>
              <TabsContent value="password">
                <div className="rounded-md border border-slate-200 p-4 space-y-3">
                  <p className="text-sm text-slate-500">Change your password here.</p>
                  <div className="space-y-1">
                    <Label htmlFor="tab-pw">New password</Label>
                    <Input id="tab-pw" type="password" />
                  </div>
                  <Button variant="secondary" size="sm">Save password</Button>
                </div>
              </TabsContent>
            </TabsRoot>
          </ShowcaseSection>

          {/* 26. Textarea */}
          <ShowcaseSection
            title="Textarea"
            description="Displays a form textarea or a component that looks like a textarea."
            docsHref="https://ui.shadcn.com/docs/components/textarea"
          >
            <div className="w-80 space-y-2">
              <Label htmlFor="message">Your message</Label>
              <Textarea id="message" placeholder="Type your message here." />
              <p className="text-sm text-slate-500">Your message will be copied to the support team.</p>
            </div>
          </ShowcaseSection>

          {/* 27. Tooltip */}
          <ShowcaseSection
            title="Tooltip"
            description="A popup that displays information related to an element when it receives keyboard focus or the mouse hovers over it."
            docsHref="https://ui.shadcn.com/docs/components/tooltip"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm">Hover me</Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add to library</p>
              </TooltipContent>
            </Tooltip>
          </ShowcaseSection>

        </div>
      </div>
    </TooltipProvider>
  );
}
