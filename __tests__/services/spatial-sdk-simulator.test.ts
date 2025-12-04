import { spatialSDK } from '../../src/services/spatial-sdk-simulator';

describe('SpatialSDKSimulator', () => {
    beforeEach(() => {
        // Reset any state if needed
        jest.clearAllMocks();
    });

    describe('isSupported', () => {
        it('should return true in simulation mode', async () => {
            const isSupported = await spatialSDK.isSupported();
            expect(isSupported).toBe(true);
        });
    });

    describe('startPassthrough', () => {
        it('should activate passthrough successfully', async () => {
            const result = await spatialSDK.startPassthrough();
            expect(result).toBe(true);
        });

        it('should take approximately 2 seconds to activate', async () => {
            const startTime = Date.now();
            await spatialSDK.startPassthrough();
            const endTime = Date.now();
            const duration = endTime - startTime;

            // Should be around 2000ms (with some tolerance)
            expect(duration).toBeGreaterThanOrEqual(1900);
            expect(duration).toBeLessThanOrEqual(2100);
        });
    });

    describe('stopPassthrough', () => {
        it('should deactivate passthrough successfully', async () => {
            await spatialSDK.startPassthrough();
            const result = await spatialSDK.stopPassthrough();
            expect(result).toBe(true);
        });
    });

    describe('getHandJoints', () => {
        it('should return data for both hands', async () => {
            const handData = await spatialSDK.getHandJoints();

            expect(handData).toHaveLength(2);
            expect(handData[0].handType).toBe('left');
            expect(handData[1].handType).toBe('right');
        });

        it('should return 21 joints per hand', async () => {
            const handData = await spatialSDK.getHandJoints();

            expect(handData[0].joints).toHaveLength(21);
            expect(handData[1].joints).toHaveLength(21);
        });

        it('should mark hands as tracked', async () => {
            const handData = await spatialSDK.getHandJoints();

            expect(handData[0].isTracked).toBe(true);
            expect(handData[1].isTracked).toBe(true);
        });

        it('should have valid joint positions', async () => {
            const handData = await spatialSDK.getHandJoints();

            handData.forEach(hand => {
                hand.joints.forEach(joint => {
                    expect(joint.position).toHaveProperty('x');
                    expect(joint.position).toHaveProperty('y');
                    expect(joint.position).toHaveProperty('z');
                    expect(typeof joint.position.x).toBe('number');
                    expect(typeof joint.position.y).toBe('number');
                    expect(typeof joint.position.z).toBe('number');
                });
            });
        });

        it('should have valid joint rotations', async () => {
            const handData = await spatialSDK.getHandJoints();

            handData.forEach(hand => {
                hand.joints.forEach(joint => {
                    expect(joint.rotation).toHaveProperty('x');
                    expect(joint.rotation).toHaveProperty('y');
                    expect(joint.rotation).toHaveProperty('z');
                });
            });
        });

        it('should have confidence values between 0.9 and 1.0', async () => {
            const handData = await spatialSDK.getHandJoints();

            handData.forEach(hand => {
                hand.joints.forEach(joint => {
                    expect(joint.confidence).toBeGreaterThanOrEqual(0.9);
                    expect(joint.confidence).toBeLessThanOrEqual(1.0);
                });
            });
        });

        it('should have different positions for left and right hands', async () => {
            const handData = await spatialSDK.getHandJoints();

            const leftHandX = handData[0].joints[0].position.x;
            const rightHandX = handData[1].joints[0].position.x;

            // Left hand should be on the left (negative X), right hand on the right (positive X)
            expect(leftHandX).toBeLessThan(0);
            expect(rightHandX).toBeGreaterThan(0);
        });
    });

    describe('getScenePlanes', () => {
        it('should return at least one plane (floor)', async () => {
            const planes = await spatialSDK.getScenePlanes();

            expect(planes.length).toBeGreaterThanOrEqual(1);
        });

        it('should have floor plane with correct properties', async () => {
            const planes = await spatialSDK.getScenePlanes();
            const floorPlane = planes.find(p => p.label === 'floor');

            expect(floorPlane).toBeDefined();
            expect(floorPlane?.id).toBe('floor-1');
            expect(floorPlane?.confidence).toBeGreaterThan(0.9);
        });

        it('should have floor plane with upward normal', async () => {
            const planes = await spatialSDK.getScenePlanes();
            const floorPlane = planes.find(p => p.label === 'floor');

            expect(floorPlane?.normal.y).toBe(1); // Upward normal
            expect(floorPlane?.normal.x).toBe(0);
            expect(floorPlane?.normal.z).toBe(0);
        });
    });

    describe('getSceneVolumes', () => {
        it('should return at least one volume (suitcase)', async () => {
            const volumes = await spatialSDK.getSceneVolumes();

            expect(volumes.length).toBeGreaterThanOrEqual(1);
        });

        it('should have suitcase volume with correct properties', async () => {
            const volumes = await spatialSDK.getSceneVolumes();
            const suitcase = volumes.find(v => v.label === 'suitcase');

            expect(suitcase).toBeDefined();
            expect(suitcase?.id).toBe('suitcase-1');
            expect(suitcase?.confidence).toBeGreaterThan(0.8);
        });

        it('should have suitcase with valid dimensions', async () => {
            const volumes = await spatialSDK.getSceneVolumes();
            const suitcase = volumes.find(v => v.label === 'suitcase');

            expect(suitcase?.size.width).toBeGreaterThan(0);
            expect(suitcase?.size.height).toBeGreaterThan(0);
            expect(suitcase?.size.depth).toBeGreaterThan(0);
        });

        it('should have suitcase with valid bounds', async () => {
            const volumes = await spatialSDK.getSceneVolumes();
            const suitcase = volumes.find(v => v.label === 'suitcase');

            expect(suitcase?.bounds).toBeDefined();
            expect(suitcase?.bounds.min).toBeDefined();
            expect(suitcase?.bounds.max).toBeDefined();

            // Max should be greater than min in all dimensions
            expect(suitcase!.bounds.max.x).toBeGreaterThan(suitcase!.bounds.min.x);
            expect(suitcase!.bounds.max.y).toBeGreaterThan(suitcase!.bounds.min.y);
            expect(suitcase!.bounds.max.z).toBeGreaterThan(suitcase!.bounds.min.z);
        });
    });

    describe('hand tracking simulation', () => {
        it('should start hand tracking', () => {
            expect(() => spatialSDK.startHandTracking()).not.toThrow();
        });

        it('should stop hand tracking', () => {
            spatialSDK.startHandTracking();
            expect(() => spatialSDK.stopHandTracking()).not.toThrow();
        });
    });

    describe('gesture simulation', () => {
        it('should simulate palm open gesture', () => {
            expect(() => spatialSDK.simulateGesture('palm_open')).not.toThrow();
        });

        it('should simulate pinch gesture', () => {
            expect(() => spatialSDK.simulateGesture('pinch')).not.toThrow();
        });

        it('should simulate fist gesture', () => {
            expect(() => spatialSDK.simulateGesture('fist')).not.toThrow();
        });
    });

    describe('suitcase detection simulation', () => {
        it('should simulate suitcase detected', async () => {
            spatialSDK.simulateSuitcaseDetection(true);
            const volumes = await spatialSDK.getSceneVolumes();
            const suitcase = volumes.find(v => v.label === 'suitcase');

            expect(suitcase?.confidence).toBeGreaterThanOrEqual(0.9);
        });

        it('should simulate suitcase not detected', async () => {
            spatialSDK.simulateSuitcaseDetection(false);
            const volumes = await spatialSDK.getSceneVolumes();
            const suitcase = volumes.find(v => v.label === 'suitcase');

            expect(suitcase?.confidence).toBeLessThan(0.2);
        });
    });

    describe('data consistency', () => {
        it('should return consistent data structure across multiple calls', async () => {
            const handData1 = await spatialSDK.getHandJoints();
            const handData2 = await spatialSDK.getHandJoints();

            expect(handData1.length).toBe(handData2.length);
            expect(handData1[0].joints.length).toBe(handData2[0].joints.length);
        });

        it('should have slightly different positions on each call (simulating movement)', async () => {
            spatialSDK.startHandTracking();

            const handData1 = await spatialSDK.getHandJoints();
            const handData2 = await spatialSDK.getHandJoints();

            const pos1 = handData1[0].joints[0].position;
            const pos2 = handData2[0].joints[0].position;

            // Positions should be different (simulating hand movement)
            const positionsAreDifferent =
                pos1.x !== pos2.x ||
                pos1.y !== pos2.y ||
                pos1.z !== pos2.z;

            expect(positionsAreDifferent).toBe(true);
        });
    });
});
