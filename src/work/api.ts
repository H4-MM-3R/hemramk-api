import { Hono } from "hono";

export const workRoutes = new Hono()
  .get("/NetworkBilling/GetDateDropDown", (c) => {
    return c.json([
      {
        From: "2024-01-01",
        To: "2024-01-31",
        Month: "January 2024",
      },
      {
        From: "2024-02-01",
        To: "2024-02-29",
        Month: "February 2024",
      },
      {
        From: "2024-03-01",
        To: "2024-03-31",
        Month: "March 2024",
      },
    ]);
  })
  .get(
    "/TransactionSearch/GetFilterViewMenu?username=ITRON\\KHEMRAM&screenName=transaction",
    (c) => {
      return c.json({
        isVisible: true,
        isDisabled: false,
        label: "Dashboard Views",
        isFavoriteEnabled: true,
        projectAdminGrant: "FULL_ACCESS",
        categories: [
          {
            key: "financial_reports",
            label: "Financial Reports",
            views: [
              {
                label: "Monthly Revenue",
                isFavorite: true,
                value: "monthly_revenue_view",
                key: "rev_monthly",
                categoryKey: "financial_reports",
                type: "chart",
                userId: "usr_789abc",
                data: {
                  filterId: 123,
                  transactionFilters: "date>=2024-01-01",
                  filterOwner: "John Smith",
                  filterCategory: 1,
                  filterName: "This Year Revenue",
                  favouriteId: 456,
                },
              },
              {
                label: "Expense Summary",
                isFavorite: false,
                value: "expense_summary_view",
                key: "exp_summary",
                categoryKey: "financial_reports",
                type: "table",
                userId: "usr_456def",
                data: {
                  filterId: 124,
                  transactionFilters: "type=expense",
                  filterOwner: "Jane Doe",
                  filterCategory: 2,
                  filterName: "All Expenses",
                  favouriteId: 457,
                },
              },
            ],
            isVisible: true,
            isExpanded: true,
          },
          {
            key: "performance_metrics",
            label: "Performance Metrics",
            views: [
              {
                label: "Team Productivity",
                isFavorite: true,
                value: "productivity_view",
                key: "prod_team",
                categoryKey: "performance_metrics",
                type: "dashboard",
                userId: "usr_123xyz",
                data: {
                  filterId: 125,
                  transactionFilters: "department=sales",
                  filterOwner: "Mike Johnson",
                  filterCategory: 3,
                  filterName: "Sales Team Metrics",
                  favouriteId: 458,
                },
              },
            ],
            isVisible: true,
            isExpanded: false,
          },
        ],
      });
    },
  )
  .get("/TransactionSearch/SystemConfiguration", (c) => {
    return c.json({
      additionalProp1: "string",
      additionalProp2: "string",
      additionalProp3: "string",
    });
  });
