import type { Meta, StoryObj } from "@storybook/react-vite";
import { Grid } from "./Grid";
import { Header } from "../Header";
import { Card } from "../Card";

const meta: Meta<typeof Grid> = {
  title: "Components/Grid",
  component: Grid,
  tags: ["autodocs"],
} satisfies Meta<typeof Grid>;
export default meta;

type Story = StoryObj<typeof Grid>;

const PlaceholderItem = ({ label = "Item", className }: { label?: string; className?: string }) => (
  <Card className={className}>
    <Card.Header>
      <Card.Title>{label}</Card.Title>
    </Card.Header>
  </Card>
);

export const Basic: Story = {
  render: () => (
    <Grid cols={3} gap={3}>
      <PlaceholderItem label="A" />
      <PlaceholderItem label="B" />
      <PlaceholderItem label="C" />
      <PlaceholderItem label="D" />
      <PlaceholderItem label="E" />
      <PlaceholderItem label="F" />
      <PlaceholderItem label="G" />
      <PlaceholderItem label="H" />
      <PlaceholderItem label="I" />
    </Grid>
  ),
};

export const TemplatePreset: Story = {
  render: () => (
    <div className="space-y-3">
      <section>
        <Header as="h4" py={3}>Masonry</Header>
        <Grid templatePreset="masonry" gap={3}>
          {Array.from({ length: 10 }, (_, i) => (
            <PlaceholderItem key={i} label={`Item ${i + 1}`} className={`h-${20 + (i % 5) * 10}`} />
          ))}
        </Grid>
      </section>
      <section>
        <Header as="h4" py={3}>Card List</Header>
        <Grid templatePreset="card-list" gap={3}>
          {Array.from({ length: 8 }, (_, i) => (
            <PlaceholderItem key={i} label={`Card ${i + 1}`} className="h-40" />
          ))}
        </Grid>
      </section>
      <section>
        <Header as="h4" py={3}>Sidebar</Header>
        <Grid templatePreset="sidebar" gap={3}>
          <PlaceholderItem label="Sidebar" className="h-40" />
          <PlaceholderItem label="Main Content" className="h-40" />
        </Grid>
      </section>
      <section>
        <Header as="h4" py={3}>Hero</Header>
        <Grid templatePreset="hero" gap={3}>
          <PlaceholderItem label="Hero Image" className="h-40" />
          <PlaceholderItem label="Hero Content" className="h-40" />
        </Grid>
      </section>
    </div>
  ),
};

export const Responsive: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <p className="text-md text-foreground-secondary">
        Resize the preview viewport to see layout change
      </p>
      <Grid cols={{ base: 1, md: 3 }} gap={{ base: 2, md: 3 }}>
        <PlaceholderItem label="1" />
        <PlaceholderItem label="2" />
        <PlaceholderItem label="3" />
      </Grid>
    </div>
  ),
};

const ALIGN_ITEMS = ["start", "end", "center", "stretch"] as const;
const JUSTIFY_ITEMS = ["start", "end", "center", "stretch"] as const;
const ALIGN_CONTENT = ["start", "end", "center", "stretch", "between", "around", "evenly"] as const;
const JUSTIFY_CONTENT = [
  "start",
  "end",
  "center",
  "between",
  "around",
  "evenly",
  "stretch",
] as const;

export const AlignmentVariants: Story = {
  render: () => (
    <div className="space-y-md">
      <section>
        <h4 className="text-md text-foreground-secondary mb-2">alignItems</h4>
        {ALIGN_ITEMS.map((a) => (
          <div key={`align-${a}`} className="mb-2">
            <Grid cols={3} gap={2} className="h-40" alignItems={a as any}>
              <PlaceholderItem label="1" />
              <PlaceholderItem label="2 (taller)" className="h-16" />
              <PlaceholderItem label="3" />
            </Grid>
          </div>
        ))}
      </section>

      <section>
        <h4 className="text-md text-foreground-secondary mb-2">justifyItems</h4>
        {JUSTIFY_ITEMS.map((j) => (
          <div key={`justify-items-${j}`} className="mb-2">
            <Grid cols={3} gap={2} className="h-100" justifyItems={j as any}>
              <PlaceholderItem label="1" className="w-24" />
              <PlaceholderItem label="2 (wider)" className="w-40" />
              <PlaceholderItem label="3" className="w-24" />
            </Grid>
          </div>
        ))}
      </section>

      <section>
        <Header as="h4" py={3}>alignContent</Header>
        {ALIGN_CONTENT.map((c) => (
          <div key={`align-content-${c}`} className="mb-2">
            <Header as="h5" py={1}>{c}</Header>
            <Grid cols={3} rows={3} gap={2} className="h-100" alignContent={c as any}>
              <PlaceholderItem label="Content 1" />
              <PlaceholderItem label="Content 2" />
              <PlaceholderItem label="Content 3" />
              <PlaceholderItem label="Content 4" />
              <PlaceholderItem label="Content 5" />
              <PlaceholderItem label="Content 6" />
              <PlaceholderItem label="Content 7" />
              <PlaceholderItem label="Content 8" />
              <PlaceholderItem label="Content 9" />
            </Grid>
          </div>
        ))}
      </section>

      <section>
        <Header as="h4" py={3}>justifyContent</Header>
        {JUSTIFY_CONTENT.map((c) => (
          <div key={`justify-content-${c}`} className="mb-2">
            <Header as="h5" py={1}>{c}</Header>
            <Grid cols={3} rows={3} gap={2} className="h-100" justifyContent={c as any}>
              <PlaceholderItem label="Content 1" />
              <PlaceholderItem label="Content 2" />
              <PlaceholderItem label="Content 3" />
              <PlaceholderItem label="Content 4" />
              <PlaceholderItem label="Content 5" />
              <PlaceholderItem label="Content 6" />
              <PlaceholderItem label="Content 7" />
              <PlaceholderItem label="Content 8" />
              <PlaceholderItem label="Content 9" />
            </Grid>
          </div>
        ))}
      </section>
    </div>
  ),
};

export const AutoFlowAutoColsRows: Story = {
  render: () => (
    <div className="space-y-md">
      <section>
        <Header as="h4" py={3}>autoFlow: row</Header>
        <Grid autoFlow="row" autoCols="min" gap={2}>
          {Array.from({ length: 10 }, (_, i) => (
            <PlaceholderItem key={i} label={`Item ${i + 1}`} />
          ))}
        </Grid>
      </section>
      <section>
        <Header as="h4" py={3}>autoFlow: column</Header>
        <Grid autoFlow="column" autoRows="min" gap={2} style={{ gridAutoColumns: "150px" }}>
          {Array.from({ length: 10 }, (_, i) => (
            <PlaceholderItem key={i} label={`Item ${i + 1}`} />
          ))}
        </Grid>
      </section>
      <section>
        <Header as="h4" py={3}>autoFlow: dense</Header>
        <Grid autoFlow="dense" autoCols="min" gap={2}>
          <PlaceholderItem label="Item 1" className="h-16" />
          <PlaceholderItem label="Item 2" />
          <PlaceholderItem label="Item 3" />
          <PlaceholderItem label="Item 4" className="h-16" />
          <PlaceholderItem label="Item 5" />
          <PlaceholderItem label="Item 6" />
          <PlaceholderItem label="Item 7" />
          <PlaceholderItem label="Item 8" />
          <PlaceholderItem label="Item 9" />
          <PlaceholderItem label="Item 10" />
        </Grid>
      </section>
    </div>
  ),
};
  