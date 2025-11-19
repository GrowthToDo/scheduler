# CloudFront Custom Error Pages Fix for API Routes

## Problem

CloudFront is configured with custom error pages that serve `index.html` for 403 and 404 responses. This causes API endpoints (like `/api/ai/chat`) to return HTML instead of JSON when they return error status codes.

## Solution

Configure CloudFront to exclude `/api/*` paths from custom error pages using a CloudFront Function.

### Step 1: Create CloudFront Function

1. Go to CloudFront Console → Functions
2. Create a new function with the following code:

```javascript
function handler(event) {
  var request = event.request;
  var uri = request.uri;

  // Don't apply custom error pages to API routes
  if (uri.startsWith("/api/")) {
    // For API routes, return the original error response
    return request;
  }

  // For non-API routes, allow CloudFront custom error pages to work
  return request;
}
```

### Step 2: Associate Function with Distribution

1. Go to your CloudFront distribution
2. Edit the distribution
3. Go to "Behaviors" tab
4. Edit the default behavior (or create a new one for `/api/*`)
5. Under "Function associations", set:
   - **Viewer request**: Select the function created above
6. Save changes

### Alternative: Path-Based Behavior

Alternatively, create a separate behavior for `/api/*` paths that does NOT have custom error responses:

1. Create a new behavior with path pattern: `/api/*`
2. Set origin and settings same as default behavior
3. **Do NOT configure custom error responses** for this behavior
4. Set the default behavior to have lower priority (higher number)

### Step 3: Update Custom Error Responses

Keep the custom error responses for 403/404, but they will only apply to non-API paths due to the function or behavior configuration above.

## Verification

After deployment:

- `/api/ai/chat` with authentication failure should return JSON: `{"error": "Authentication required..."}`
- Non-API routes (like `/some-page`) should still serve `index.html` for 404 errors (SPA routing)

## Current CloudFront Configuration

The distribution currently has:

- 403 → `/index.html` (status 200)
- 404 → `/index.html` (status 200)

This needs to be modified to exclude `/api/*` paths.
