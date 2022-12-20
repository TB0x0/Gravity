# Gravity-Simulation 
### Simulates gravity by using Newton's Equation 

## Future Features

1. A function that can efficiently determine if one object is orbiting another. It will be used to simulate a planet forming rings from a moon orbiting it.

2. Physics solver solve_nMass function that actually uses the quadtree.

    - Add a sample function that updates the position of each of the objects inside of a node of a spacial tree based on the changed position of the node itself.

3. Use a fragment shader to do physics solving stuff on the GPU

4. A class that initiates the application with different conditions from a json file. for example

  - Binary orbit

  - Lots of objects

  - Solar system to scale

  - etc...


## Build Instructions for NodeJS

1. Clone the repository 
2. cd into the main repository folder i.e C:\repos\Gravity
3. Run npm install to install dependencies
4. Run npm start
5. Navigate to http://127.0.0.1:8080