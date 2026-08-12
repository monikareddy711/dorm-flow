import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../components/Badge.js';
import { IssueStatus, IssueUrgency } from '@dormflow/shared-types';

const meta: Meta<typeof Badge> = {
  title: 'Foundation/Badge',
  component: Badge,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const StatusSubmitted: Story = {
  args: {
    status: IssueStatus.SUBMITTED,
  },
};

export const StatusInProgress: Story = {
  args: {
    status: IssueStatus.IN_PROGRESS,
  },
};

export const StatusResolved: Story = {
  args: {
    status: IssueStatus.RESOLVED,
  },
};

export const UrgencyEmergency: Story = {
  args: {
    urgency: IssueUrgency.EMERGENCY,
  },
};

export const UrgencyHigh: Story = {
  args: {
    urgency: IssueUrgency.HIGH,
  },
};
