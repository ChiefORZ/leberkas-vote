'use client';

import { TrashIcon } from '@heroicons/react/24/outline';
import { gql, request } from 'graphql-request';
import { useState } from 'react';

import { Button } from '@/components/Button';

export const DeleteItemMutation = gql`
  mutation deleteItem($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;

export const DeleteButton = ({ item }) => {
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(item.deleted);

  const handleDeleteItem = async () => {
    setDeleting(true);
    await request(new URL('/api', window.location.origin).toString(), DeleteItemMutation, {
      id: item.id,
    });
    setDeleted(true);
    setDeleting(false);
  };

  return (
    <Button
      disabled={deleting || deleted}
      loading={deleting}
      onClick={handleDeleteItem}
      size="sm"
      variant="destructive"
    >
      <TrashIcon className="h-4 w-4" data-testid="trash-icon" />
    </Button>
  );
};
