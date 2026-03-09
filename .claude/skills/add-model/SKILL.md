---
name: add-model
description: Scaffold a new Mongoose model with TypeScript types for the Quantum Commerce backend. Use when the user says "add a model", "create a schema", "new model for X", or "I need a database model". Ask for the model name and fields before generating.
---

# Add Model

You are scaffolding a new Mongoose model for the Quantum Commerce backend.

## Step 1: Gather Requirements

Ask the user:
1. What is the model name? (e.g. `Order`, `Review`, `Wishlist`)
2. What fields does it need? For each field, ask: name, type (String/Number/Boolean/Date/ObjectId ref), required or optional, any constraints (unique, min, max, enum values)?
3. Does it reference another model (e.g. userId ref to User)?
4. Should it have timestamps (`createdAt`, `updatedAt`)?

Only move to Step 2 after you have enough information to proceed.

## Step 2: Read Existing Models for Conventions

Before writing anything, read these reference files:
- `backend/src/models/User.ts`
- `backend/src/models/Product.ts`

Match their patterns exactly: import style, schema structure, TypeScript interface, export format.

## Step 3: Create the Model File

Create the file at `backend/src/models/{ModelName}.ts`.

Follow this pattern:
```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface I{ModelName} extends Document {
  // all fields with TypeScript types
  createdAt: Date;
}

const {ModelName}Schema: Schema = new Schema(
  {
    // field definitions using Mongoose schema types
    // use: type: Schema.Types.ObjectId, ref: 'ModelName' for references
    // use: type: String, enum: ['A', 'B'], required: true for enums
    // use: type: Number, min: 0 for numbers
  },
  { timestamps: true }
);

export default mongoose.model<I{ModelName}>('{ModelName}', {ModelName}Schema);
```

## Step 4: Add TypeScript Interface to Frontend (if needed)

If the model will be queried from the frontend, ask if the user wants to add a matching TypeScript interface to `frontend/quantumcommerce-frontend/models/index.ts`.

If yes, read that file first and append a matching `I{ModelName}` interface using only plain types (no Mongoose imports on the frontend).

## Step 5: Summary

Tell the user:
- What file was created and where
- What fields were added
- Next steps: "Now use `/add-resolver` to expose this model via GraphQL"
- Flag any known bugs or issues in the model design (e.g. missing indexes, missing validation)
