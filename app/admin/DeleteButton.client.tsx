'use client';

import { TrashIcon } from '@heroicons/react/24/outline';
import { gql, request } from 'graphql-request';
import { useState } from 'react';

import { Button } from '@/components/Button';

const DeleteItemMutation = gql`
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
    await request('/api', DeleteItemMutation, { id: item.id });
    setDeleted(true);
    setDeleting(false);
  };

  return (
    <Button
      size="sm"
      loading={deleting}
      variant="destructive"
      onClick={handleDeleteItem}
      disabled={deleting || deleted}
    >
      <TrashIcon className="h-4 w-4" />
    </Button>
  );
};
