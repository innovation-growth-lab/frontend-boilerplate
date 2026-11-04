import {ArrowRight, Download, Info} from 'lucide-react';
import {Fragment} from 'react';
import {Button} from '@/components/ui/button';
import {Checkbox} from '@/components/ui/checkbox';
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from '@/components/ui/combobox';
import {Container} from '@/components/ui/container';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {Eyebrow} from '@/components/ui/eyebrow';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {Textarea} from '@/components/ui/textarea';
import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip';
import {pageTitle} from '../config.js';

// Every component in src/components/ui, in its IGL styling: a reference when
// building pages, and a screen to check after restyling one. Behind the
// componentsPage flag, which deploy.sh turns off for the live site.

const COUNTRIES = [
  'Austria',
  'Belgium',
  'Canada',
  'Denmark',
  'Finland',
  'France',
  'Germany',
  'Ireland',
  'Netherlands',
  'Spain',
  'United Kingdom',
];

const STAGES = [
  {label: 'Choose a stage', value: null},
  {label: 'Design', value: 'design'},
  {label: 'Run', value: 'run'},
  {label: 'Report', value: 'report'},
];

export default function Components() {
  const chipsAnchor = useComboboxAnchor();
  return (
    <>
      <title>{pageTitle('Components')}</title>
      <Container className="flex flex-col gap-16 pt-14 pb-20">
        <div className="flex flex-col gap-4">
          <Eyebrow className="text-blue">Reference</Eyebrow>
          <h1 className="text-5xl">Components</h1>
          <p className="max-w-prose">
            shadcn/ui components from <code>src/components/ui</code>, styled to
            the IGL design system. Add more with{' '}
            <code>npx shadcn add &lt;name&gt;</code>, then restyle them to
            match.
          </p>
        </div>

        <Section title="Button">
          {['default', 'sm', 'lg'].map((size) => (
            <div key={size} className="flex flex-wrap items-center gap-4">
              <Button size={size}>
                Primary <ArrowRight data-icon="inline-end" />
              </Button>
              <Button size={size} variant="secondary">
                Secondary
              </Button>
              <Button size={size} variant="ghost">
                Ghost
              </Button>
              <Button size={size} variant="outline">
                Outline
              </Button>
              <Button size={size} variant="destructive">
                Destructive
              </Button>
              <Button size={size} variant="link">
                Link
              </Button>
            </div>
          ))}
          <div className="flex flex-wrap items-center gap-4">
            <Button disabled>Disabled</Button>
            <Button variant="outline" disabled>
              Disabled
            </Button>
            <Button variant="outline" size="icon" aria-label="Download">
              <Download />
            </Button>
          </div>
        </Section>

        <Section title="Form fields">
          <div className="grid max-w-xl gap-8">
            <Field label="Organisation" id="organisation">
              <Input id="organisation" placeholder="e.g. Nesta" />
            </Field>
            <Field label="What are you testing?" id="question">
              <Textarea id="question" placeholder="One or two sentences" />
            </Field>
            <Field label="Stage" id="stage">
              <Select items={STAGES}>
                <SelectTrigger id="stage" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STAGES.map((item) => (
                    <SelectItem key={item.label} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <div className="flex items-start gap-3">
              <Checkbox id="updates" defaultChecked />
              <Label htmlFor="updates" className="font-sans text-lg">
                Send me updates about new tools
              </Label>
            </div>
          </div>
        </Section>

        <Section title="Combobox">
          <div className="grid max-w-xl gap-8">
            <Field label="Country" id="country">
              <Combobox items={COUNTRIES}>
                <ComboboxInput
                  id="country"
                  placeholder="Start typing a country"
                  className="w-full"
                  showClear
                />
                <ComboboxContent>
                  <ComboboxEmpty>No countries found.</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item} value={item}>
                        {item}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </Field>
            <Field label="Countries (several)" id="countries">
              <Combobox
                multiple
                autoHighlight
                items={COUNTRIES}
                defaultValue={['United Kingdom']}
              >
                <ComboboxChips ref={chipsAnchor}>
                  <ComboboxValue>
                    {(values) => (
                      <Fragment>
                        {values.map((value) => (
                          <ComboboxChip key={value}>{value}</ComboboxChip>
                        ))}
                        <ComboboxChipsInput
                          id="countries"
                          placeholder="Add a country"
                        />
                      </Fragment>
                    )}
                  </ComboboxValue>
                </ComboboxChips>
                <ComboboxContent anchor={chipsAnchor}>
                  <ComboboxEmpty>No countries found.</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item} value={item}>
                        {item}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </Field>
          </div>
        </Section>

        <Section title="Dialog, menu and tooltip">
          <div className="flex flex-wrap items-center gap-4">
            <Dialog>
              <DialogTrigger render={<Button variant="outline" />}>
                Open dialog
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save this trial?</DialogTitle>
                  <DialogDescription>
                    It's kept in this browser only, so it won't appear on
                    another device.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose render={<Button variant="secondary" />}>
                    Cancel
                  </DialogClose>
                  <Button>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline" />}>
                Open menu
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                <DropdownMenuItem>Download</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button variant="ghost" size="icon" aria-label="About" />
                }
              >
                <Info />
              </TooltipTrigger>
              <TooltipContent>Effect sizes are standardised</TooltipContent>
            </Tooltip>
          </div>
        </Section>

        <Section title="Tabs">
          <Tabs defaultValue="design" className="max-w-xl">
            <TabsList>
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="run">Run</TabsTrigger>
              <TabsTrigger value="report">Report</TabsTrigger>
            </TabsList>
            <TabsContent value="design">
              Set the question, the sample and the measures.
            </TabsContent>
            <TabsContent value="run">
              Recruit, randomise and deliver.
            </TabsContent>
            <TabsContent value="report">
              Analyse and write up the results.
            </TabsContent>
          </Tabs>
        </Section>
      </Container>
    </>
  );
}

function Section({title, children}) {
  return (
    <section className="flex flex-col gap-6 border-t border-border pt-8">
      <h2 className="text-3xl">{title}</h2>
      {children}
    </section>
  );
}

// A label above its control.
function Field({label, id, children}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}
