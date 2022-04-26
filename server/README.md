#SME DAT integration custom activity

##Migration
1. Create new migration
    - npm run typeorm:migration:generate -- update
2. Ensure server is running
3. Apply new migration
    - npm run typeorm:migration:run