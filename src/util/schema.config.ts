export const schemaConfig = {
  id: true,
  versionKey: false,
  timestamps: true,
  autoIndex: true,
  toJSON: {
    virtuals: true,
    transform: (_, ret) => {
      // TODO: delete all fields not required on the frontend
      delete ret._id;
      // delete ret.password;
      // delete ret.hash;
      delete ret.visible;
      delete ret.updatedAt;
      // delete ret.events;
      // delete ret.addressCoordinates;
      delete ret.code;
      delete ret.secretQuestions;
      return ret;
    },
  },
  toObject: {
    virtuals: true,
    transform: (_, ret) => {
      // delete ret._id;
      // delete ret.password;
      // delete ret.hash;
      delete ret.visible;
      // delete ret.events;
      // delete ret.addressCoordinates;
      delete ret.updatedAt;
      delete ret.code;
      delete ret.secretQuestions;
      return ret;
    },
  },
};
