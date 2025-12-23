'use client';

import { CheckIcon } from '@heroicons/react/24/outline';
import { gql, request } from 'graphql-request';
import { useState } from 'react';

import { Button } from '@/components/Button';

export const PublishItemMutation = gql`
  mutation publishItem($id: ID!) {
    publishItem(id: $id) {
      id
    }
  }
`;

export const PublishButton = ({ item }) => {
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(item.published);

  const handlePublishItem = async () => {
    setPublishing(true);
    await request(
      new URL('/api', window.location.origin).toString(),
      PublishItemMutation,
      {
        id: item.id,
      }
    );
    setPublished(true);
    setPublishing(false);
  };

  return (
    <Button
      disabled={publishing || published}
      loading={publishing}
      onClick={handlePublishItem}
      size="sm"
      variant="default"
    >
      <CheckIcon className="h-4 w-4" data-testid="check-icon" />
    </Button>
  );
};
