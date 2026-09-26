import { Pagination as NativePagination, PaginationItem } from '@mui/material';
import { Link } from '@tanstack/react-router';
import { m } from '#/paraglide/messages';

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
                ? m.common_pagination_page({ page: item.page ?? '' })
                : m.common_pagination_go_to({ type: item.type })
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
