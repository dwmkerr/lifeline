export interface LifeEvent {
  userId: string;
  id: string;
  title: string;
  date: Date;
  notes: string | null;
}

export interface SerializableLifeEvent {
  userId: string;
  id: string;
  title: string;
  date: string;
  notes: string | null;
}

export function toSerializableObject(event: LifeEvent): SerializableLifeEvent {
  return {
    userId: event.userId,
    id: event.id,
    title: event.title,
    date: event.date.toISOString(),
    notes: event.notes,
  };
}

//  When we deserialize we are a little less strict - some fields are allowed
//  to be missing. This is because the model is growing over time and
//  historic records may not have all of the newer fields.
//  For this clever 'AtLeast' type see:
//  https://stackoverflow.com/questions/48230773/how-to-create-a-partial-like-that-requires-a-single-property-to-be-set
type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;
export type MinimumSerializableLifeEvent = AtLeast<
  SerializableLifeEvent,
  "userId" | "id" | "title" | "date"
>;
export function fromSerializableObject(
  object: MinimumSerializableLifeEvent,
): LifeEvent {
  function parseDateString<T>(obj: T, fieldName: keyof T): Date {
    const dateString = obj[fieldName] as string;
    const parsedDate = new Date(dateString);

    if (isNaN(parsedDate.getTime())) {
      throw new Error(
        `date field '${String(fieldName)}' is invalid: ${dateString}`,
      );
    }

    return parsedDate;
  }

  //  Note that as well as deserializing, this code is also handling the logic
  //  for fields which might not be stored (for example fields which have been
  //  added to the extension since the puzzle was initially logged). This is
  //  also covered in the unit tests.
  return {
    userId: object.userId,
    id: object.id,
    title: object.title,
    date: object.date ? parseDateString(object, "date") : new Date(),
    notes: object.notes || "",
  };
}
