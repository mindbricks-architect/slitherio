# Service Design Specification - Object Design for playerSession

**slitherio-playersession-service** documentation

## Document Overview

This document outlines the object design for the `playerSession` model in our application. It includes details about the model's attributes, relationships, and any specific validation or business logic that applies.

## playerSession Data Object

### Object Overview

**Description:** Represents an anonymous player&#39;s ephemeral in-session identity. Manages temporary display name, session token, connection state, avatar linkage, and session lifetime. No persistence beyond active session.

This object represents a core data structure within the service and acts as the blueprint for database interaction, API generation, and business logic enforcement.
It is defined using the `ObjectSettings` pattern, which governs its behavior, access control, caching strategy, and integration points with other systems such as Stripe and Redis.

### Core Configuration

- **Soft Delete:** Disabled — Determines whether records are marked inactive (`isActive = false`) instead of being physically deleted.
- **Public Access:** accessPublic — If enabled, anonymous users may access this object’s data depending on API-level rules.

### Composite Indexes

- **uniqueSessionToken**: [sessionToken]
  This composite index is defined to optimize query performance for complex queries involving multiple fields.

The index also defines a conflict resolution strategy for duplicate key violations.

When a new record would violate this composite index, the following action will be taken:

**On Duplicate**: `throwError`

An error will be thrown, preventing the insertion of conflicting data.

### Properties Schema

| Property            | Type    | Required | Description                                                                                                 |
| ------------------- | ------- | -------- | ----------------------------------------------------------------------------------------------------------- |
| `displayName`       | String  | No       | Temporary player display name (chosen/provided by player or auto-generated guest label)                     |
| `sessionToken`      | String  | Yes      | A unique, ephemeral token identifying this player session; required for reconnection/resume and anti-abuse. |
| `connectionStatus`  | Enum    | Yes      | Current ephemeral connection state: &#39;connected&#39;, &#39;disconnected&#39;, &#39;reconnecting&#39;.    |
| `lastKnownAvatarId` | String  | No       | Points to the current in-game avatar for sync with gameWorld service. Used for reconnection/clean removal.  |
| `joinTime`          | Date    | Yes      | Timestamp when player joined the game session.                                                              |
| `leaveTime`         | Date    | No       | Timestamp when player left/disconnected from the session (or null if still active).                         |
| `finalScore`        | Integer | No       | Final score delivered to player upon exit/disconnect (populated via game event feedback).                   |
| `finalRank`         | Integer | No       | Final ranking for player in this session, provided at exit/summary.                                         |
| `reconnectExpiry`   | Date    | No       | Deadline for player to reconnect before session is fully purged (set at disconnect).                        |

- Required properties are mandatory for creating objects and must be provided in the request body if no default value is set.

### Default Values

Default values are automatically assigned to properties when a new object is created, if no value is provided in the request body.
Since default values are applied on db level, they should be literal values, not expressions.If you want to use expressions, you can use transposed parameters in any business API to set default values dynamically.

- **sessionToken**: 'default'
- **connectionStatus**: connected
- **joinTime**: new Date()

### Constant Properties

`sessionToken` `joinTime`

Constant properties are defined to be immutable after creation, meaning they cannot be updated or changed once set. They are typically used for properties that should remain constant throughout the object's lifecycle.
A property is set to be constant if the `Allow Update` option is set to `false`.

### Auto Update Properties

`displayName` `connectionStatus` `lastKnownAvatarId` `leaveTime` `finalScore` `finalRank` `reconnectExpiry`

An update crud API created with the option `Auto Params` enabled will automatically update these properties with the provided values in the request body.
If you want to update any property in your own business logic not by user input, you can set the `Allow Auto Update` option to false.
These properties will be added to the update API's body parameters and can be updated by the user if any value is provided in the request body.

### Enum Properties

Enum properties are defined with a set of allowed values, ensuring that only valid options can be assigned to them.
The enum options value will be stored as strings in the database,
but when a data object is created an addtional property with the same name plus an idx suffix will be created, which will hold the index of the selected enum option.
You can use the index property to sort by the enum value or when your enum options represent a sequence of values.

- **connectionStatus**: [connected, disconnected, reconnecting]

### Elastic Search Indexing

`displayName` `sessionToken` `connectionStatus`

Properties that are indexed in Elastic Search will be searchable via the Elastic Search API.
While all properties are stored in the elastic search index of the data object, only those marked for Elastic Search indexing will be available for search queries.

### Database Indexing

`sessionToken` `connectionStatus` `reconnectExpiry`

Properties that are indexed in the database will be optimized for query performance, allowing for faster data retrieval.
Make a property indexed in the database if you want to use it frequently in query filters or sorting.

### Unique Properties

`sessionToken`

Unique properties are enforced to have distinct values across all instances of the data object, preventing duplicate entries.
Note that a unique property is automatically indexed in the database so you will not need to set the `Indexed in DB` option.

### Secondary Key Properties

`sessionToken`

Secondary key properties are used to create an additional indexed identifiers for the data object, allowing for alternative access patterns.
Different than normal indexed properties, secondary keys will act as primary keys and Mindbricks will provide automatic secondary key db utility functions to access the data object by the secondary key.

### Relation Properties

`lastKnownAvatarId`

Mindbricks supports relations between data objects, allowing you to define how objects are linked together.
You can define relations in the data object properties, which will be used to create foreign key constraints in the database.
For complex joins operations, Mindbricks supportsa BFF pattern, where you can view dynamic and static views based on Elastic Search Indexes.
Use db level relations for simple one-to-one or one-to-many relationships, and use BFF views for complex joins that require multiple data objects to be joined together.

- **lastKnownAvatarId**: String
  Relation to `avatar`.id

The target object is a sibling object, meaning that the relation is a many-to-one or one-to-one relationship from this object to the target.

On Delete: Set Null
Required: No

### Filter Properties

`connectionStatus`

Filter properties are used to define parameters that can be used in query filters, allowing for dynamic data retrieval based on user input or predefined criteria.
These properties are automatically mapped as API parameters in the listing API's that have "Auto Params" enabled.

- **connectionStatus**: Enum has a filter named `connectionStatus`
