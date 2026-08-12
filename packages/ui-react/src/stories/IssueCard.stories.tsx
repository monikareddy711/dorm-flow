import type { Meta, StoryObj } from '@storybook/react';
import { IssueCard } from '../components/IssueCard.js';
import { IssueStatus, IssueCategory, IssueUrgency, LocationType } from '@dormflow/shared-types';

const meta: Meta<typeof IssueCard> = {
  title: 'Domain/IssueCard',
  component: IssueCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof IssueCard>;

export const DefaultHeating: Story = {
  args: {
    issue: {
      id: 'iss-101',
      title: 'Radiator valve leaking and cold in bedroom',
      description: 'The bedroom radiator does not heat up and drops water steadily onto the parquet floor.',
      category: IssueCategory.HEATING,
      urgency: IssueUrgency.HIGH,
      status: IssueStatus.IN_PROGRESS,
      locationType: LocationType.PRIVATE_ROOM,
      buildingId: 'bld-kastanienweg',
      building: { id: 'bld-kastanienweg', name: 'Wohnheim Kastanienweg', address: 'Kastanienweg 35, Aachen', createdAt: '', updatedAt: '' },
      roomNumber: '412',
      createdByUserId: 'usr-1',
      createdAt: '2026-07-10T14:30:00.000Z',
      updatedAt: '2026-07-11T09:20:00.000Z',
      commentsCount: 3,
      followersCount: 2,
    },
  },
};

export const ResolvedLaundry: Story = {
  args: {
    issue: {
      id: 'iss-102',
      title: 'Washing machine 3 displays Error E20 (drain blocked)',
      description: 'Basement laundry room: Machine 3 stops mid-cycle with water remaining inside.',
      category: IssueCategory.LAUNDRY,
      urgency: IssueUrgency.MEDIUM,
      status: IssueStatus.RESOLVED,
      locationType: LocationType.LAUNDRY_ROOM,
      buildingId: 'bld-kastanienweg',
      building: { id: 'bld-kastanienweg', name: 'Wohnheim Kastanienweg', address: 'Kastanienweg 35, Aachen', createdAt: '', updatedAt: '' },
      roomNumber: 'Basement U02',
      createdByUserId: 'usr-1',
      createdAt: '2026-07-14T18:00:00.000Z',
      updatedAt: '2026-07-15T08:45:00.000Z',
      commentsCount: 1,
      followersCount: 4,
    },
  },
};
