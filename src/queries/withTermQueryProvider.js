/**
 * queries/withTermQueryProvider.js
 *
 * Higher-order component that provides the QueryClient for queries.
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export const withTermQueryProvider = ( Component ) => {
	return ( props ) => (
		<QueryClientProvider client={ queryClient }>
			<Component { ...props } />
		</QueryClientProvider>
	);
};

export default withTermQueryProvider;
