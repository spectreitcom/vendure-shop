import { Pagination as NativePagination, PaginationItem } from '@mui/material';
import { Link } from '@tanstack/react-router';

type Props = Readonly<{
  totalItems: number;
  searchParamsToCopy?: Record<string, string>;
  categorySlug: string;
  page: number;
}>;

export function CollectionProductsPagination({
  totalItems,
  searchParamsToCopy,
  categorySlug,
  page,
}: Props) {
  return (
    <NativePagination
      count={totalItems}
      shape="rounded"
      siblingCount={0}
      page={page}
      renderItem={(item) => {
        if (item.disabled) {
          return <PaginationItem {...item} />;
        }

        return (
          <Link
            aria-label={
              item.type === 'page'
                ? `Page ${item.page}`
                : `Go to ${item.type} page`
            }
            aria-current={item.selected ? 'page' : undefined}
            to="/$categorySlug"
            params={{ categorySlug }}
            search={{ ...searchParamsToCopy, page: item.page ?? undefined }}
          >
            <PaginationItem {...item} component="span" />
          </Link>
        );
      }}
    />
  );
}
