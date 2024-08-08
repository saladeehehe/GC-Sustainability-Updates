# Folder Documentation for `src/` 
This folder contains the source code, including all the main components and configurations necessary for the website.


<!-- DIRECTORY STRUCTURE -->
## Directory Structure

### `src/`

- **App.tsx**: The main component of the React application. It sets up the primary structure, handles state management, and renders the main components of the application, including the navigation bar, search bar, news articles, and theme configuration.
- **main.tsx**: Initializes the React application and renders the root component (`App.tsx`) into the DOM. Includes necessary imports for styles and configurations.
- **App.css**: Defines the layout and styles for the grid container, navbar, and main content area of the application. Uses CSS Grid Layout to create a two-column layout with a sidebar (navbar) and main content area.
- **theme.ts**: Creates and exports the theme configuration for the application using Mantine. Converts the theme into CSS variables for use with vanilla-extract.
- **vite-env.d.ts**: Includes type declarations provided by Vite for client-side development. Ensures TypeScript has the necessary type information for Vite-specific features and APIs.

### `src/components/`

#### Components of the Sidebar:

- **NavbarMinimal.tsx**: Defines a customizable navbar component using various Mantine components and icons from the Tabler icons set. Integrates functionalities such as:
  - **Source Filter**: `FilterSourceButton.tsx` defines a button for filtering news sources.
  - **Date Filter**: `DateFilter.tsx` allows users to select a date range using a popover with a date picker and predefined date ranges. `DateFilter.css` provides styling for this component.
  - **Category Filter**: `CategoryFilter.tsx` enables filtering news articles by categories. `articleCategorizer.ts` contains the declaration of categories by specific keywords and the function to add category attributes to each news article.
  - **Bookmark Button**: Integrated within `NavbarMinimal.tsx`, this button allows users to toggle the visibility of bookmarked articles, enhancing content management.
  - **SearchableMultiSelect.tsx**: Used in the Source Filter and Category Filter components to provide a searchable, multi-select dropdown.
  - **Sources Button:** `SourcesComponent.tsx` defines a source button which when clicked, brings users to the list of sources where news articles in this website are extracted from. Additional relevant resources are also provided.

#### Components of the Main Page:

- **newsComponent.tsx**: Defines `NewsComponent`, which displays news articles in a responsive grid layout. Articles are shown in cards with titles, summaries, formatted dates, sources, and categories. Categories are color-coded with badges, and users can bookmark or unbookmark articles using an action icon. Utilizes Mantine's UI components and includes functionality for handling bookmarks and formatting dates.
- **newsComponent.ts**: Defines the structure for a news article object.
- **SearchBar.tsx**: Provides a search input field for filtering news articles based on titles and content.
- **Grid.tsx**: Defines a function for the grid layout used in `newsComponent.tsx`.

### Additional Folders

- **Welcome/**: Contains files related to the welcome page of the application.
  - **Welcome.css.ts**: Styles for the welcome page.
  - **Welcome.tsx**: The React component for the welcome page.



```sh
src/
├── components/
│   └── ...
├── utils/
│   ├── dateUtils.ts
├── Welcome/
│   ├── Welcome.css.ts
│   └── Welcome.tsx
├── App.tsx
├── App.css
├── main.tsx
├── theme.ts
├── vite-env.d.ts
```
