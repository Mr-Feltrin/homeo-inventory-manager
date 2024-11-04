### Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/your-username/homeo_inventory.git
    cd homeo_inventory
    ```

2. Install PHP dependencies:

    ```sh
    composer install
    ```

3. Install JavaScript dependencies:

    ```sh
    npm install
    ```

4. Copy the example environment file and configure it:

    ```sh
    cp .env.example .env
    ```

5. Generate an application key:

    ```sh
    php artisan key:generate
    ```

6. Run database migrations:

    ```sh
    php artisan migrate
    ```

7. Build the frontend assets:

    ```sh
    npm run build
    ```

### Running the Application

8. Start the local development server:

    ```sh
    php artisan serve
    ```

9. Start the Vite development server:

    ```sh
    npm run dev
    ```

10. Visit `http://localhost:8000` in your browser.

For more detailed documentation, please refer to the [main documentation](../README.md).
