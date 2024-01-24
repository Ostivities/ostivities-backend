async findUserWithCars(userId: string): Promise<User> {
    return this.userModel.findById(userId).populate('cars').exec();
  }