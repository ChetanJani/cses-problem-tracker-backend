import request from "supertest";
import app from "../src/app.js";
import { Problem } from "../src/models/cses.model.js";

describe("Random problem generator", () => {
    describe("when request body is empty", () => {
        it("returns status code 400", async () => {
            const res = await request(app).post("/cses/random").send({});
            expect(res.status).toBe(400);
            expect(res.body.message).toEqual("Incorrect Request Body");
        });
    });

    describe("when categories is of different datatype", () => {
        it("returns status code 400", async () => {
            const res = await request(app)
                .post("/cses/random")
                .send({ categories: "arrays" });
            expect(res.status).toBe(400);
            expect(res.body.message).toEqual("Incorrect Request Body");
        });
    });

    describe("when categories is an empty array", () => {
        it("returns status code 400", async () => {
            const res = await request(app)
                .post("/cses/random")
                .send({ categories: [] });
            expect(res.status).toBe(400);
            expect(res.body.message).toEqual("Incorrect Request Body");
        });
    });

    describe("when categories contain invalid category names", () => {
        it("returns status code 400", async () => {
            await Problem.create({
                id: 374,
                title: "K Subset Sums I",
                category: "Additional Problems II",
                url: "https://cses.fi/problemset/task/3108",
                status: "unsolved",
            });

            const res = await request(app)
                .post("/cses/random")
                .send({
                    categories: ["Additional Problems II", "invalid-name"],
                });
            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Categories are invalid");
        });
    });

    describe("when no unsolved problems exist for given categories", () => {
        it("returns status code 200", async () => {
            await Problem.create({
                id: 374,
                title: "K Subset Sums I",
                category: "Additional Problems II",
                url: "https://cses.fi/problemset/task/3108",
                status: "solved",
            });

            const res = await request(app)
                .post("/cses/random")
                .send({ categories: ["Additional Problems II"] });

            expect(res.status).toBe(200);
            expect(res.body.message).toBe("All problems have been solved !!");
        });
    });

    describe("when there is atleast 1 unsolved problem", () => {
        it("returns status code 200", async () => {
            await Problem.create({
                id: 374,
                title: "K Subset Sums I",
                category: "Additional Problems II",
                url: "https://cses.fi/problemset/task/3108",
                status: "unsolved",
            });

            const res = await request(app)
                .post("/cses/random")
                .send({
                    categories: ["Additional Problems II"],
                });

            expect(res.status).toBe(200);
            expect(res.body.message).toBe("Random Problem Generated");
            expect(res.body.data.length).toBe(1);

            // fields that must NOT be present
            expect(res.body.data[0]).not.toHaveProperty("_id");
            expect(res.body.data[0]).not.toHaveProperty("id");
            expect(res.body.data[0]).not.toHaveProperty("category");

            // fields that MUST be present
            expect(res.body.data[0]).toHaveProperty("title");
            expect(res.body.data[0]).toHaveProperty("url");
            expect(res.body.data[0]).toHaveProperty("status", "unsolved");
        });
    });
});

describe("List of Problems", () => {
    describe("when categories field is not present", () => {
        it("returns status code 400", async () => {
            const req = {
                status: [],
            };
            const res = await request(app).post("/cses/list").send(req);
            expect(res.status).toBe(400);
            expect(res.body.message).toEqual("Incorrect Request Body");
        });
    });
    describe("when categories datatype is different", () => {
        it("returns status code 400", async () => {
            const req = {
                categories: "string",
                status: [],
            };
            const res = await request(app).post("/cses/list").send(req);
            expect(res.status).toBe(400);
            expect(res.body.message).toEqual("Incorrect Request Body");
        });
    });
    describe("when categories is empty array", () => {
        it("returns status code 400", async () => {
            const req = {
                categories: [],
                status: [],
            };
            const res = await request(app).post("/cses/list").send(req);
            expect(res.status).toBe(400);
            expect(res.body.message).toEqual("Incorrect Request Body");
        });
    });
    describe("when categories value's datatype is not string", () => {
        it("returns status code 400", async () => {
            const req = {
                categories: [12],
                status: [],
            };
            const res = await request(app).post("/cses/list").send(req);
            expect(res.status).toBe(400);
            expect(res.body.message).toEqual("Incorrect Request Body");
        });
    });
    describe("when categories value is invalid", () => {
        it("returns status code 400", async () => {
            const req = {
                categories: ["invalid value"],
                status: ["solved"],
            };
            const res = await request(app).post("/cses/list").send(req);
            expect(res.status).toBe(400);
            expect(res.body.message).toEqual("Please provide valid categories");
        });
    });
    describe("when status field is not present", () => {
        it("returns status code 400", async () => {
            const req = {
                categories: ["abc"],
            };
            const res = await request(app).post("/cses/list").send(req);
            expect(res.status).toBe(400);
            expect(res.body.message).toEqual("Incorrect Request Body");
        });
    });
    describe("when status datatype is different", () => {
        it("returns status code 400", async () => {
            const req = {
                categories: ["abc"],
                status: "string",
            };
            const res = await request(app).post("/cses/list").send(req);
            expect(res.status).toBe(400);
            expect(res.body.message).toEqual("Incorrect Request Body");
        });
    });
    describe("when status is empty array", () => {
        it("returns status code 400", async () => {
            const req = {
                categories: ["abc"],
                status: [],
            };
            const res = await request(app).post("/cses/list").send(req);
            expect(res.status).toBe(400);
            expect(res.body.message).toEqual("Incorrect Request Body");
        });
    });
    describe("when status value's datatype is not string", () => {
        it("returns status code 400", async () => {
            const req = {
                categories: ["abc"],
                status: [12],
            };
            const res = await request(app).post("/cses/list").send(req);
            expect(res.status).toBe(400);
            expect(res.body.message).toEqual("Incorrect Request Body");
        });
    });
    describe("when status value is invalid", () => {
        it("returns status code 400", async () => {
            const req = {
                categories: ["abc"],
                status: ["xyz"],
            };
            const res = await request(app).post("/cses/list").send(req);
            expect(res.status).toBe(400);
            expect(res.body.message).toEqual("Incorrect Request Body");
        });
    });
    describe("when request body is correct but no problems found", () => {
        it("return status code 200", async () => {
            const seedData = [
                {
                    id: 1,
                    title: "Weird Algorithm",
                    category: "Introductory Problems",
                    url: "https://cses.fi/problemset/task/1068",
                    status: "unsolved",
                },
            ];
            await Problem.create(seedData);

            const req = {
                categories: ["Introductory Problems"],
                status: ["solved"],
            };
            const res = await request(app).post("/cses/list").send(req);
            expect(res.status).toBe(200);
            expect(res.body.message).toEqual("No Problems found");
        });
    });
    describe("when request body is correct and has returned value", () => {
        it("return status code 200", async () => {
            const seedData = [
                {
                    id: 1,
                    title: "Weird Algorithm",
                    category: "Introductory Problems",
                    url: "https://cses.fi/problemset/task/1068",
                    status: "unsolved",
                },
            ];
            await Problem.create(seedData);

            const req = {
                categories: ["Introductory Problems"],
                status: ["unsolved"],
            };
            const res = await request(app).post("/cses/list").send(req);
            expect(res.status).toBe(200);
            expect(res.body.message).toEqual(
                "Successfully fetched all the problems",
            );
        });
    });
});

describe("All Categories List", () => {
    describe("when request for a categories list", () => {
        it("return status code 200 and non-empty list", async () => {
            const seedData = [
                {
                    id: 1,
                    title: "Weird Algorithm",
                    category: "Introductory Problems",
                    url: "https://cses.fi/problemset/task/1068",
                    status: "unsolved",
                },
                {
                    id: 102,
                    title: "Planets Queries II",
                    category: "Graph Algorithms",
                    url: "https://cses.fi/problemset/task/1160",
                    status: "unsolved",
                },
            ];
            await Problem.create(seedData);
            const res = await request(app).get("/cses/categories");
            expect(res.status).toBe(200);
            expect(res.body.message).toEqual("All Categories Fetched");
            expect(res.body.data).not.toHaveLength(0);
        });
    });
});

describe("All Statuses List", () => {
    describe("when request for a statuses list", () => {
        it("return status code 200 and non-empty list", async () => {
            const res = await request(app).get("/cses/statuses");
            expect(res.status).toBe(200);
            expect(res.body.message).toEqual("Statuses Feched Successfully");
            expect(res.body.data).toHaveLength(3);
        });
    });
});

describe("Problem Status Change", () => {
    describe("when id field is missing", () => {
        it("returns status code 400", async () => {
            const req = {
                status: "solved",
            };
            const res = await request(app)
                .post("/cses/status-change")
                .send(req);
            expect(res.status).toBe(400);
            expect(res.body.message).toEqual("Incorrect Request Body");
        });
    });
    describe("when id field's datatype is not number or is alphanumeric string", () => {
        it("returns status code 400", async () => {
            const req = {
                id: "12a",
                status: "solved",
            };
            const res = await request(app)
                .post("/cses/status-change")
                .send(req);
            expect(res.status).toBe(400);
            expect(res.body.message).toEqual("Incorrect Request Body");
        });
    });
    describe("when id field's datatype numeric string but problem doesn't exist", () => {
        it("returns status code 400", async () => {
            const req = {
                id: "12",
                status: "solved",
            };
            const res = await request(app)
                .post("/cses/status-change")
                .send(req);
            expect(res.status).toBe(400);
            expect(res.body.message).toEqual(
                "Please select appropriate problem",
            );
        });
    });
    describe("when problem doesn't exist", () => {
        it("returns status code 400", async () => {
            const seedData = [
                {
                    id: 102,
                    title: "Planets Queries II",
                    category: "Graph Algorithms",
                    url: "https://cses.fi/problemset/task/1160",
                    status: "unsolved",
                },
            ];
            await Problem.create(seedData);

            const req = {
                id: 12,
                status: "solved",
            };
            const res = await request(app)
                .post("/cses/status-change")
                .send(req);
            expect(res.status).toBe(400);
            expect(res.body.message).toEqual(
                "Please select appropriate problem",
            );
        });
    });
    describe("when status field is missing", () => {
        it("returns status code", async () => {
            const req = {
                id: 12,
            };
            const res = await request(app)
                .post("/cses/status-change")
                .send(req);
            expect(res.status).toBe(400);
            expect(res.body.message).toEqual("Incorrect Request Body");
        });
    });
    describe("when status field's datatype is not string", () => {
        it("returns status code 400", async () => {
            const req = {
                id: 12,
                status: [],
            };
            const res = await request(app)
                .post("/cses/status-change")
                .send(req);
            expect(res.status).toBe(400);
            expect(res.body.message).toEqual("Incorrect Request Body");
        });
    });
    describe("when status is invalid", () => {
        it("returns status code 400", async () => {
            const req = {
                id: 12,
                status: "xyz",
            };
            const res = await request(app)
                .post("/cses/status-change")
                .send(req);
            expect(res.status).toBe(400);
            expect(res.body.message).toEqual("Incorrect Request Body");
        });
    });
    describe("when status has been changed successfully", () => {
        it("returns status code 201", async () => {
            const seedData = [
                {
                    id: 102,
                    title: "Planets Queries II",
                    category: "Graph Algorithms",
                    url: "https://cses.fi/problemset/task/1160",
                    status: "unsolved",
                },
            ];
            await Problem.create(seedData);

            const req = {
                id: 102,
                status: "solved",
            };
            const res = await request(app)
                .post("/cses/status-change")
                .send(req);
            expect(res.status).toBe(201);
            expect(res.body.message).toEqual(
                "Problem status has been changed!!",
            );
        });
    });
});

describe("Search Problem using Title or URL", ()=>{
    describe("when neither title not url is provided", ()=>{
        it("returns status code 400", async () =>{
            const res = await request(app).get("/cses/title-link");
            expect(res.status).toBe(400);
            expect(res.body.message).toEqual("Provide valid Title or URL");
        })
    });
    describe("when provided wrong url", ()=>{
        it("returns status code 400", async () => {
            const seedData = [
                {
                    id: 1,
                    title: "Weird Algorithm",
                    category: "Introductory Problems",
                    url: "https://cses.fi/problemset/task/1068",
                    status: "unsolved",
                },
            ];
            await Problem.create(seedData);

            const res = await request(app)
                .get("/cses/title-link")
                .query({ url: "emset/task/106823" });
            expect(res.status).toBe(400);
            expect(res.body.message).toEqual("Please Enter Valid URL");
        });
    });
    describe("when provided correct url", ()=>{
        it("returns status code 200", async () => {
            const seedData = [
                {
                    id: 1,
                    title: "Weird Algorithm",
                    category: "Introductory Problems",
                    url: "https://cses.fi/problemset/task/1068",
                    status: "unsolved",
                },
            ];
            await Problem.create(seedData);
    
            const res = await request(app)
                .get("/cses/title-link")
                .query({ url: "emset/task/1068" });
            expect(res.status).toBe(200);
            expect(res.body.message).toEqual("Problem Fetched Successfully");
            expect(res.body.data).not.toHaveLength(0);
        });
    });
    describe("when provided title's problem doesn't exist", ()=>{
        it("returns status code 400", async () => {
            const seedData = [
                {
                    id: 1,
                    title: "Weird Algorithm",
                    category: "Introductory Problems",
                    url: "https://cses.fi/problemset/task/1068",
                    status: "unsolved",
                },
            ];
            await Problem.create(seedData);

            const res = await request(app)
                .get("/cses/title-link")
                .query({ title: "chetan" });
            expect(res.status).toBe(400);
            expect(res.body.message).toEqual("Please Enter Valid Title");
        });
    });
    describe("when provided title's problems exist", ()=>{
        it("returns status code 200", async () => {
            const seedData = [
                {
                    id: 1,
                    title: "Weird Algorithm",
                    category: "Introductory Problems",
                    url: "https://cses.fi/problemset/task/1068",
                    status: "unsolved",
                },
            ];
            await Problem.create(seedData);

            const res = await request(app)
                .get("/cses/title-link")
                .query({ title: "Weird Algo" });
            expect(res.status).toBe(200);
            expect(res.body.message).toEqual("Problems Fetched Successfully");
            expect(res.body.data).not.toHaveLength(0);
        });
    });
    describe("when provided valid title and url both", ()=>{
        it("returns status code 200 and gives priority to title", async () => {
            const seedData = [
                {
                    id: 1,
                    title: "Weird Algorithm",
                    category: "Introductory Problems",
                    url: "https://cses.fi/problemset/task/1068",
                    status: "unsolved",
                },
                {
                    "id": 103,
                    "title": "Planets Cycles",
                    "category": "Graph Algorithms",
                    "url": "https://cses.fi/problemset/task/1751",
                    "status": "unsolved"
                }
            ];
            await Problem.create(seedData);

            const res = await request(app)
                .get("/cses/title-link")
                .query({ title: "Weird Algo", url: "t/task/1751" });
            expect(res.status).toBe(200);
            expect(res.body.message).toEqual("Problems Fetched Successfully");
            expect(res.body.data).not.toHaveLength(0);
        });
    })
})
