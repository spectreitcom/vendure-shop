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
      defaultPage={1}
      page={page}
      renderItem={(item) => {
        if (item.disabled) {
          return <PaginationItem {...item} />;
        }

        return (
          <Link
            to={'/$categorySlug'}
            params={{ categorySlug }}
            search={{
              ...searchParamsToCopy,
              page: item.page === null ? undefined : item.page,
            }}
          >
            <PaginationItem {...item} />
          </Link>
        );
      }}
    />
  );
}
